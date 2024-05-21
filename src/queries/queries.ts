import {TransactionStatus} from "../models";

export const CreateAccount = () => {
  return `INSERT INTO account (id, fullname, email, type, cpf, cnpj, balance) VALUES (?, ?, ?, ?, ?, ?, ?);`;
}

export const CreateTransaction = () => {
  return `INSERT INTO transaction (id, sender_id, receiver_id, amount, status) VALUES (?, ?, ?, ?, ?);`;
}

export const GetAccount = (id: string) => {
  return `SELECT * FROM account WHERE id = '${id}';`;
}

export const GetTransaction = (id: string) => {
  return `SELECT * FROM transaction WHERE id = '${id}';`;
}

export const UpdateBalance = (id: string, balance: number) => {
  return `UPDATE account SET balance = '${balance}', updated_at = CURRENT_TIMESTAMP WHERE id = '${id}';`;
}

export const UpdateTransaction = (id: string, status: TransactionStatus) => {
  return `UPDATE transaction SET status = '${status}', updated_at = CURRENT_TIMESTAMP WHERE id = '${id}';`;
}

export const ListTransactions = (id: string) => {
  return `SELECT * FROM transaction WHERE sender_id = '${id}' OR receiver_id = '${id}';`;
}