// import mysql from "mysql2";
import { config } from "../config/config";
import{ Sequelize } from 'sequelize';

const { host, user, database, password, port } = config.db;
const dbPort:number = parseInt(port);

export const sequelize = new Sequelize(database, user, password, {
  host,
  dialect:'mysql',
  port:dbPort,
});
