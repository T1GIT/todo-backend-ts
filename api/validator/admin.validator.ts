import { AdminRequests } from "../controller/admin.controller"
import { body, param, ValidationChain } from "express-validator"


export type AdminValidator = Record<AdminRequests, ValidationChain[]>

const adminValidator: AdminValidator = {
    changeRole: [
        body('userId').exists().isMongoId(),
        body('role').isIn(['ADMIN', 'BASIC'])
    ],
    removeSessions: [
        body('userId').optional().isMongoId(),
    ],
    getLog: [
        param('logName').exists().isString()
    ],
    cleanOutdated: []
}


export default adminValidator
