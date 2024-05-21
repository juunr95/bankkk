import {ClientType} from "../models";

export type AccountEntityType = {
  id: string
  fullname: string
  email: string
  type: ClientType
  cpf?: string
  cnpj?: string
  balance: number
}

export class Account {
  props?: AccountEntityType

  constructor(account: AccountEntityType) {
    this.props = account;
  }

  /**
   * Magic getter.
   *
   * @param key
   */
  get = (key: keyof AccountEntityType) => {
    return this.props?.[key];
  }
}