import { NextFunction, Request, Response } from "express"
import { AuthRequest } from "../../middleware/plugin"
import userService from "../../data/service/user.service"
import { AdminRights, NotFound } from "../../util/http-error"
import { Role } from "../../data/model/User"
import sessionService, { sessionCleaner } from "../../data/service/session.service"
import path from "path"
import config from "../../util/logger/config"
import * as fs from "fs"


export type AdminTool = Record<'adminRights' | 'logExists',
    (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>>

export const adminTool: AdminTool = {
    async adminRights(req: AuthRequest, res: Response, next: NextFunction) {
        const { auth: {userId} } = req
        const user = await userService.getById(userId)
        if (user.role == Role.ADMIN) {
            next()
        } else {
            next(new AdminRights("you don't have enough rights"))
        }
    },
    async logExists(req: AuthRequest, res: Response, next: NextFunction) {
        const { logName } = req.params
        const parsed = path.parse(logName)
        const filePath = path.join(config.DIR, parsed.name + config.EXT)
        if (fs.existsSync(filePath)) {
            next()
        } else {
            next(new NotFound(`log file with name ${ logName }`))
        }
    }
}

export type AdminRequests = 'changeRole' | 'removeSessions' | 'getLog' | 'cleanOutdated' // TODO: new ver/ Add route

export type AdminController = Record<AdminRequests,
    (req: AuthRequest, res: Response) => Promise<void>>

const adminController: AdminController = {
    async changeRole(req: AuthRequest, res: Response) {
        const {userId, role}: {
            userId: number,
            role: Role
        } = req.body
        if (! await userService.existsById(userId))
            throw new NotFound(`user with id ${userId}`)
        await userService.update(userId, { role })
        res.sendStatus(204)
    },
    async removeSessions(req: AuthRequest, res: Response) {
        const {userId}: {
            userId: number
        } = req.body
        if (userId) {
            if (! await userService.existsById(userId))
                throw new NotFound(`user with id ${userId}`)
            await sessionService.removeByUserId(userId)
        } else {
            await sessionService.removeAll()
        }
        res.sendStatus(204)
    },
    async getLog(req: AuthRequest, res: Response) {
        const { logName } = req.params
        const parsed = path.parse(logName)
        const filePath = path.join(config.DIR, parsed.name + config.EXT)
        res.download(filePath)
    },
    cleanOutdated(req: AuthRequest, res: Response): Promise<void> {
        return sessionCleaner.outdated()
    },
}


export default adminController
