import { CategoryRequests } from "../controller/category.controller"
import { ValidationChain } from "express-validator"
import { TaskRequests } from "../controller/task.controller"


const { body, param, query } = require('express-validator');


const validators = {
    body: [
        body('title').optional().isLength({ max: 100 }),
        body('description').optional().isLength({ max: 1000 }),
        body('completed').optional().isBoolean()
    ]
}

export type TaskValidator = Record<TaskRequests, ValidationChain[]>

const taskValidator: TaskValidator = {
    getOne: [],
    getAll: [
        query(['limit', 'offset']).optional().isInt()
    ],
    create: [
        ...validators.body
    ],
    update: [
        ...validators.body
    ],
    remove: []
}


export default taskValidator
