import {createConnection} from "mysql2/promise";

export const DatabasePlugin = () => {
  return createConnection({
    user: 'root',
    password: 'root',
    database: 'bankkk',
    host: 'localhost',
    port: 3306,
  });
}