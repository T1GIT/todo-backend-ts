import { body, ValidationChain } from "express-validator"
import { UserRequests } from "../controller/user.controller"


const regExp = {
    psw: /^.*(?=.*[a-zA-Zа-яА-Я])(?=.*\d).*$/
}

export type UserValidator = Record<UserRequests, ValidationChain[]>

const userValidator: UserValidator = {
    getOne: [],
    update: [
        body('email').optional().isEmail().normalizeEmail().isLength({ min: 5, max: 255 }),
        body('psw').optional().isString().isLength({ min: 8, max: 255 }).matches(regExp.psw),
        body('name').optional().isString().isLength({ min: 1, max: 99 }),
        body('surname').optional().isString().isLength({ min: 1, max: 99 }),
        body('patronymic').optional().isString().isLength({ min: 1, max: 99 }),
        body('birthdate').optional().isDate().toDate().isBefore()
    ],
    remove: []
}


export default userValidator
