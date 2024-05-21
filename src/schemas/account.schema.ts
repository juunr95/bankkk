
export const AccountSchema = {
  type: 'object',
  required: ['fullname', 'email', 'type'],
  properties: {
    id: {type: 'string'},
    fullname: {type: 'string'},
    email: {type: 'string'},
    type: {type: 'string'},
    cpf: {type: 'string'},
    cnpj: {type: 'string'},
  },
  if: {
    properties: {
      type: {
        const: 'common',
      },
    },
  },
  then: {
    required: ['cpf'],
  },
  else: {
    required: ['cnpj'],
  },
}