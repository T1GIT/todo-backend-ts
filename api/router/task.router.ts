import express from "express"
import { categoryTool } from "../controller/category.controller"
import taskController, { taskTool } from "../controller/task.controller"
import taskValidator from "../validator/task.validator"
import errorHandlerFilter from "../../middleware/filter/error-handler.filter"


const taskRouter = express.Router()

taskRouter
    .use('category/:categoryId/tasks',
        categoryTool.exists)
    .route('category/:categoryId/tasks')
    .get(
        taskValidator.getAll,
        errorHandlerFilter(
            taskController.getAll))
    .post(
        taskValidator.create,
        errorHandlerFilter(
            taskController.create))

taskRouter
    .use('category/:categoryId/task/:taskId',
        categoryTool.exists)
    .route('category/:categoryId/task/:taskId')
    .get(
        taskTool.exists,
        errorHandlerFilter(
            taskController.getOne))
    .patch(
        taskTool.exists,
        taskValidator.update,
        errorHandlerFilter(
            taskController.update))
    .delete(
        errorHandlerFilter(
            taskController.remove))


export default taskRouter
