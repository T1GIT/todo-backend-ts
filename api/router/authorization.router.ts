import express from "express"
import authorizationValidator from "../validator/authorization.validator"
import errorHandlerFilter from "../../middleware/filter/error-handler.filter"
import authorizationController from "../controller/authorization.controller"


const authorizationRouter = express.Router()


authorizationRouter
    .post('/login',
        authorizationValidator.login,
        errorHandlerFilter(
            authorizationController.login))

authorizationRouter.route('/')
    .post(
        authorizationValidator.register,
        errorHandlerFilter(
            authorizationController.register))
    .put(
        authorizationValidator.refresh,
        errorHandlerFilter(
            authorizationController.refresh))
    .delete(
        authorizationValidator.logout,
        errorHandlerFilter(
            authorizationController.logout))


export default authorizationRouter
