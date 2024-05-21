import {FastifyReply, FastifyRequest} from "fastify";
import {v4 as uuidv4} from "uuid";
import {ResultSetHeader} from "mysql2/promise";
import {CreateAccount, CreateTransaction, GetAccount, ListTransactions, UpdateBalance} from "../queries";
import {Account as AccountModel, ClientType, TransactionStatus} from "../models";
import {ValidateCnpj, ValidateCpf, ValidateEmail, ValidateType} from "../validations";

export class AccountController {
  /**
   * Create an account.
   *
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   */
  static async createAccount(request: FastifyRequest, reply: FastifyReply) {
    try {
      // @ts-ignore
      const { database } = request.server;
      const account = request.body as AccountModel;

      // Validations.
      const valid = [
        ValidateEmail(account.email),
        ValidateType(account.type),
        ValidateCpf(account.cpf),
        ValidateCnpj(account.cnpj)
      ].every(validation => validation);

      if (!valid) {
        return reply.code(400).send({ message: 'Invalid data.'});
      }

      const id = uuidv4();

      await database.execute<ResultSetHeader[]>(CreateAccount(), [
        id, account.fullname, account.email, account.type, account.cpf || null, account.cnpj || null, 1000
      ]);
      const [result] = await database.execute<ResultSetHeader[]>(GetAccount(id));

      return reply.code(201).send(result[0]);
    } catch (err: any) {
      switch(err.code) {
        case 'ER_DUP_ENTRY':
          return reply.code(403).send({ message: 'Account already exists.'});
      }
    }
  }

  /**
   * Create a transaction.
   *
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   */
  static async createTransaction(request: FastifyRequest, reply: FastifyReply) {
    try {
      // @ts-ignore
      const { queue, database } = request.server;
      const { sender_id, receiver_id, amount } = request.body as any;

      if (sender_id == receiver_id) {
        return reply.code(403).send({message: 'Cannot send money to yourself'})
      }

      let [sender] = await database.execute<ResultSetHeader[]>(GetAccount(sender_id));
      sender = sender.shift();

      if (sender.type === ClientType.Shopkeeper) {
        return reply.code(403).send({message: 'Shopkeepers cannot send money'})
      }

      if (sender.balance < amount) {
        return reply.code(403).send({message: 'Insufficient balance'})
      }

      const id = uuidv4();
      await database.execute<ResultSetHeader[]>(UpdateBalance(sender_id, sender.balance - amount))

      // Create a new transaction.
      const [row] = await database.execute<ResultSetHeader>(CreateTransaction(), [
        id, sender_id, receiver_id, amount, TransactionStatus.Waiting
      ]);

      // If transaction created, send it to queue.
      if (row.affectedRows === 1) {
        const channel = await queue.createChannel();

        await channel.assertQueue('transaction');
        channel.sendToQueue('transaction', Buffer.from(id));
        await channel.close();
      }

      return reply.code(201).send({message: 'Transaction created successfully'})
    } catch (err) {
      return reply.code(500).send(err);
    }
  }

  /**
   * List user transactions.
   *
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   */
  static async getTransactions(request: FastifyRequest, reply: FastifyReply) {
    try {
      // @ts-ignore
      const { database } = request.server;
      const { id } = request.params as any;

      const [transactions] = await database.execute<ResultSetHeader[]>(ListTransactions(id));

      return reply.code(200).send(transactions);
    } catch (err) {
      return reply.code(500).send(err);
    }
  }

  /**
   * Get user balance.
   *
   * @param {FastifyRequest} request
   * @param {FastifyReply} reply
   */
  static async getBalance(request: FastifyRequest, reply: FastifyReply) {
    try {
      // @ts-ignore
      const { database } = request.server;
      const { id } = request.params as any;

      let [account] = await database.execute<ResultSetHeader[]>(GetAccount(id));
      account = account.shift();

      return reply.code(200).send(account);
    } catch (err) {
      return reply.code(500).send(err);
    }
  }
}