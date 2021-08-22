import express from "express"
import serviceRouter from "./service.router"
import authorizationRouter from "./authorization.router"
import authenticationPlugin from "../../middleware/plugin/authentication.plugin"
import adminRouter from "./admin.router"
import userRouter from "./user.router"
import categoryRouter from "./category.router"
import taskRouter from "./task.router"


const rootRouter = express.Router()

rootRouter
    .use('/authorization',
        authorizationRouter)
    .use('/admin',
        authenticationPlugin, adminRouter)
    .use('/user',
        authenticationPlugin, userRouter)
    .use('/todo/categories',
        authenticationPlugin, categoryRouter, taskRouter)


export default rootRouter
