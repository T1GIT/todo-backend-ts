import express from "express"
import categoryValidator from "../validator/category.validator"
import errorHandlerFilter from "../../middleware/filter/error-handler.filter"
import categoryController, { categoryTool } from "../controller/category.controller"


const categoryRouter = express.Router()


categoryRouter
    .route('/categories')
    .get(
        categoryValidator.getAll,
        errorHandlerFilter(
            categoryController.getAll))
    .post(
        categoryValidator.create,
        errorHandlerFilter(
            categoryController.create))

categoryRouter
    .route('category/:categoryId')
    .get(
        categoryValidator.getOne,
        categoryTool.exists,
        errorHandlerFilter(
            categoryController.getOne)
    )
    .patch(
        categoryTool.exists,
        categoryValidator.update,
        errorHandlerFilter(
            categoryController.update))
    .delete(
        categoryValidator.remove,
        errorHandlerFilter(
            categoryController.remove))


export default categoryRouter
