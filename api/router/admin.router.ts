import adminController, { adminTool } from "../controller/admin.controller"
import express from "express"
import adminValidator from "../validator/admin.validator"
import errorHandlerFilter from "../../middleware/filter/error-handler.filter"


const adminRouter = express.Router()

adminRouter
    .use('/', adminTool.adminRights)
    .patch('/role',
        adminValidator.changeRole,
        errorHandlerFilter(
            adminController.changeRole))
    .get('/log',
        adminValidator.getLog,
        adminTool.logExists,
        errorHandlerFilter(
            adminController.getLog))
    .delete('/sessions',
        adminValidator.removeSessions,
        errorHandlerFilter(
            adminController.removeSessions))
    .delete('/sessions/outdated',
        adminValidator.cleanOutdated,
        errorHandlerFilter(
            adminController.cleanOutdated))


export default adminRouter
