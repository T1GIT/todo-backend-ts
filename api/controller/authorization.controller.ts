import userService from "../../data/service/user.service"
import sessionService, { sessionCleaner } from "../../data/service/session.service"
import jwtProvider from "../../security/provider/jwt.provider"
import refreshProvider from "../../security/provider/refresh.provider"
import { Request, Response } from "express"
import _ from "lodash"


const loginFields = ['email', 'psw']
const registerFields = [...loginFields, 'name', 'surname', 'patronymic', 'birthdate']

export type AuthorizationRequests = 'register' | 'login' | 'refresh' | 'logout'

export type AuthorizationController = Record<AuthorizationRequests,
    (req: Request, res: Response) => Promise<void>>

const authorizationController: AuthorizationController = {
    async register(req: Request, res: Response) {
        const { user, fingerprint } = req.body
        const filteredUser: any = _.pick(user, registerFields)
        const { id: userId } = await userService.create(filteredUser)
        const { refresh } = await sessionService.create(userId, fingerprint)
        refreshProvider.attach(refresh, res)
        const jwt = await jwtProvider.create({ userId })
        res.status(201).json({ jwt })
    },
    async login(req: Request, res: Response) {
        const { user, fingerprint } = req.body
        const filteredUser: any = _.pick(user, loginFields)
        const { id: userId } = await userService.authorize(filteredUser)
        await sessionCleaner.fingerprint(userId, fingerprint)
        const { refresh } = await sessionService.create(userId, fingerprint)
        refreshProvider.attach(refresh, res)
        const jwt = await jwtProvider.create({ userId })
        res.status(200).json({ jwt })
    },
    async refresh(req: Request, res: Response) {
        const refreshCookie = refreshProvider.extract(req)
        const { fingerprint } = req.body
        const { refresh, userId } = await sessionService.refresh(refreshCookie, fingerprint)
        refreshProvider.attach(refresh, res)
        const jwt = await jwtProvider.create({ userId })
        res.status(200).json({ jwt })
    },
    async logout(req: Request, res: Response) {
        const refreshCookie = refreshProvider.extract(req)
        await sessionService.removeOne(refreshCookie)
        refreshProvider.erase(res)
        res.sendStatus(204)
    }
}


export default authorizationController
