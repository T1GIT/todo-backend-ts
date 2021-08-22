import { body, query, ValidationChain } from "express-validator"
import { CategoryRequests } from "../controller/category.controller"


const validators = {
    name: body('name').optional().isLength({ max: 100 })
}

export type CategoryValidator = Record<CategoryRequests, ValidationChain[]>

const categoryValidator: CategoryValidator = {
    getOne: [],
    getAll: [
        query(['limit', 'offset']).optional().isInt()
    ],
    create: [
        validators.name
    ],
    update: [
        validators.name
    ],
    remove: []
}


export default categoryValidator
