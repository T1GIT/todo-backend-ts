import userService from "../../data/service/user.service"
import _ from "lodash"
import { AuthRequest } from "../../middleware/plugin"
import { Request, Response } from "express"


const fields = ['email', 'psw', 'name', 'surname', 'patronymic', 'birthdate']

export type UserRequests = 'getOne' | 'update' | 'remove'

export type UserController = Record<UserRequests,
    (req: Request, res: Response) => Promise<void>>

const userController: UserController = {
    async getOne(req: AuthRequest, res: Response) {
        const { auth: {userId} } = req
        const user = await userService.getById(userId)
        res.status(200).json(_.pick(user, fields))
    },
    async update(req: AuthRequest, res: Response) {
        const { auth: {userId} } = req
        const user = _.pick(req.body, fields)
        await userService.update(userId, user)
        res.sendStatus(204)
    },
    async remove(req: AuthRequest, res: Response) {
        const { auth: {userId} } = req
        await userService.remove(userId)
        res.sendStatus(204)
    }
}


export default userController
