import {fastify} from "fastify";
import {DatabasePlugin} from "./src/infraestructure/database";
import {QueuePlugin} from "./src/infraestructure/queue";
import * as routes from "./src/routes";
import {Transaction, TransactionStatus} from "./src/models";
import {GetAccount, GetTransaction, UpdateBalance, UpdateTransaction} from "./src/queries";
import {ResultSetHeader} from "mysql2/promise";
import {Message} from "amqplib";

const server = fastify();

Promise.all([DatabasePlugin(), QueuePlugin()]).then(async ([database, queue]) => {
  server.decorate('database', database);
  server.decorate('queue', queue);

  // Register all routes inside routes.
  Object.values(routes).forEach(route => server.register(route));

  server.listen({port: 3000}, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })

  const channel = await queue.createChannel();
  await channel.prefetch(0);
  // Create queues.
  await channel.assertQueue('transaction');
  await channel.assertQueue('transaction.rollback')

  /**
   * Consumer for the 'transaction.rollback' queue.
   */
  await channel.consume('transaction.rollback', async (message) => {
    const id = message?.content.toString();
    if (!id) return;

    const [transaction] = await database.execute<any[]>(GetTransaction(id as string));

    if (transaction[0].status === TransactionStatus.Failed) {
      console.log(`[x] Transaction already processed...`);
      channel.ack(message as Message);
    }

    const [sender] = await database.query<any[]>(GetAccount(transaction[0].sender_id));

    console.log(`[x] Transaction failed. Doing rollback...`)

    await database.query<ResultSetHeader>(UpdateBalance(transaction[0].sender_id, sender[0].balance + transaction[0].amount));

    await database.query<ResultSetHeader>(UpdateTransaction(id as string, TransactionStatus.Failed));

    channel.ack(message as Message);
  }, { noAck: false })


  /**
   * Consumer for the 'transaction' queue.
   */
  await channel.consume('transaction', async (message) => {
    try {
      const id = message?.content.toString();
      if (!id) return;

      console.info(`[x] Received ${id}`);

      const [transaction] = await database.execute<any[]>(GetTransaction(id as string));

      if (transaction[0].status !== TransactionStatus.Waiting) {
        console.info(`[x] Transaction ${transaction[0].id} already processed`);
        // @ts-ignore
        channel.ack(message);
        return;
      }

      await database.query(UpdateTransaction(id as string, TransactionStatus.Processing));

      console.info(`[x] Processing transaction ${transaction[0].id}`);

      const [sender] = await database.query<any[]>(GetAccount(transaction[0].sender_id));
      const [receiver] = await database.query<any[]>(GetAccount(transaction[0].receiver_id));

      console.info(`[x] Processing transaction ${transaction[0].id} from ${sender[0].id} to ${receiver[0].id}`);

      // Randomly get a value to simulate a failed transaction.
      if (Math.random() < 0.5) {
        channel.sendToQueue('transaction.rollback', Buffer.from(id))
        return
      }

      // Do a promise to simulate an external api access.
      await new Promise(resolve => setTimeout(resolve, 1000));

      await database.query<ResultSetHeader>(UpdateBalance(transaction[0].receiver_id, receiver[0].balance + (transaction[0] as unknown as Transaction).amount))
      await database.query<ResultSetHeader>(UpdateTransaction(id as string, TransactionStatus.Success));

      console.info(`[x] Transaction ${transaction[0].id} succeeded`);

      channel.ack(message as Message);
    } catch (err) {
      channel.reject(message as Message, false);
    }
  }, {  noAck: false });

  process.on('SIGTERM', async () => {
    await server.close();
    channel.nackAll();
    await queue.close();
    await database.end();
  })
})