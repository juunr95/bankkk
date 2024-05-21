import {ClientType} from "../models";

export const ValidateEmail = (email: string) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const ValidateCpf = (cpf?: string) => {
  if (!cpf) {
    return true;
  }

  const re = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
  return re.test(String(cpf).toLowerCase());
}

export const ValidateCnpj = (cnpj?: string) => {
  if (!cnpj) {
    return true;
  }

  const re = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
  return re.test(String(cnpj).toLowerCase());
}

export const ValidateType = (type: string) => {
  return Object.values(ClientType).includes(type as ClientType);
}