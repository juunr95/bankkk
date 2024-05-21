

export const TransactionSchema = {
  type: 'object',
  required: ['sender_id', 'receiver_id', 'amount'],
  properties: {
    sender_id: {type: 'string'},
    receiver_id: {type: 'string'},
    amount: {type: 'number'},
  },
}