export enum TransactionStatus {
  Waiting = "waiting",
  Processing = "processing",
  Success = "completed",
  Failed = "failed",
}

export type Transaction = {
  /**
   * Transaction id.
   */
  id: string;
  /**
   * Sender id.
   */
  senderId: string;
  /**
   * Receiver id.
   */
  receiverId: string;
  /**
   * Transaction amount.
   */
  amount: number;
  /**
   * Transaction status.
   */
  status: TransactionStatus;
  /**
   * Timestamp.
   */
  createdAt?: Date;
}