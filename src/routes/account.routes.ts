import {FastifyInstance, FastifyPluginOptions} from "fastify";
import {AccountSchema} from "../schemas";
import {TransactionSchema} from "../schemas/transaction.schema";
import {AccountController} from "../controllers";


export const AccountRoutes = (app: FastifyInstance, opts: FastifyPluginOptions, next: any) => {
  app.post('/account', { schema: { body: AccountSchema }}, AccountController.createAccount);
  app.post('/account/send', { schema: { body: TransactionSchema }}, AccountController.createTransaction);
  app.get('/account/transactions/:id', AccountController.getTransactions);
  app.get('/account/:id', AccountController.getBalance);
  next();
};