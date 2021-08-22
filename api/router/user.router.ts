import express from "express"
import userValidator from "../validator/user.validator"
import errorHandlerFilter from "../../middleware/filter/error-handler.filter"
import userController from "../controller/user.controller"


const userRouter = express.Router()


userRouter.route('/')
    .get(
        userValidator.getOne,
        errorHandlerFilter(
            userController.getOne))
    .patch(
        userValidator.update,
        errorHandlerFilter(
            userController.update))
    .delete(
        userValidator.remove,
        errorHandlerFilter(
            userController.remove))


export default userRouter
