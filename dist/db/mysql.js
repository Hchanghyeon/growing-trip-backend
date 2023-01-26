"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
// import mysql from "mysql2";
const config_1 = require("../config/config");
const sequelize_1 = require("sequelize");
const { host, user, database, password, port } = config_1.config.db;
const dbPort = parseInt(port);
exports.sequelize = new sequelize_1.Sequelize(database, user, password, {
    host,
    dialect: 'mysql',
    port: dbPort,
});
