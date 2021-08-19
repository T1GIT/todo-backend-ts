import { Sequelize } from "sequelize-typescript";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from "../environment";
import User from "./model/User";
import Session from "./model/Session";
import Category from "./model/Category"
import Task from "./model/Task"

export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: DB_HOST,
    port: parseInt(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    models: [User, Session, Category, Task]
})

export * from './service/user.service'
export * from './service/session.service'
export * from './service/category.service'
export * from './service/task.service'
