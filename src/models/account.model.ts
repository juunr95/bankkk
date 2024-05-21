export enum ClientType {
  Common = "common",
  Shopkeeper = "shopkeeper",
}

export interface Account {
  /**
   * The account id.
   */
  id: string;
  /**
   * The account fullname.
   */
  fullname: string;
  /**
   * The account email.
   */
  email: string;
  /**
   * The account type.
   */
  type: ClientType;
  /**
   * The account cpf.
   */
  cpf?: string;
  /**
   * The account cnpj.
   */
  cnpj?: string;
  /**
   * The account balance.
   */
  balance: number;
}