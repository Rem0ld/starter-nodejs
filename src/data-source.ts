import dotenv from "dotenv";
import { DataSource } from "typeorm";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.HOST_BDD,
  port: +process.env.PORT_BDD,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: false,
  dropSchema: false,
  entities: [],
  migrations: [],
  subscribers: [],
});
