import Session from "../model/Session"
import securityConfig from "../../security/config"
import { nanoid } from "nanoid"
import { Op, fn } from "sequelize"
import config from "../config"
import { SessionError } from "../../util/http-error"
import _ from "lodash"


function createExpires(): Date {
    const date = new Date()
    date.setDate(date.getDate() + securityConfig.EXPIRE_PERIOD.REFRESH)
    return date
}

function createRefresh(): string {
    return nanoid(securityConfig.KEY_LENGTH.REFRESH)
}

export type SessionCleaner = {
    fingerprint(userId: number, fingerprint: string): Promise<void>
    overflow(userId: number): Promise<void>
    outdated(): Promise<void>
}

export type SessionService = {
    create(userId: number, fingerprint: string): Promise<Session>
    refresh(refresh: string, fingerprint: string): Promise<Session>
    removeOne(refresh: string): Promise<void>
    removeAll(): Promise<void>
    removeByUserId(userId: number): Promise<void>
}

export const sessionCleaner: SessionCleaner = {
    async fingerprint(userId: number, fingerprint: string): Promise<void> {
        await Session.destroy({
            where: { userId, fingerprint }
        })
    },
    async outdated(): Promise<void> {
        await Session.destroy({
            where: {
                expires: { [Op.lt]: new Date() }
            }
        })
    },
    async overflow(userId: number): Promise<void> {
        const sessions = await Session.findAll({
            where: { userId }
        })
        if (sessions.length > config.MAX_SESSIONS) {
            await Session.destroy({
                where: { userId },
                limit: sessions.length - config.MAX_SESSIONS
            })
        }
    }

}

const sessionService: SessionService = {
    create(userId: number, fingerprint: string): Promise<Session> {
        return Session.create({
            userId,
            fingerprint,
            expires: createExpires(),
            refresh: createRefresh()
        })
    },
    async refresh(refresh: string, fingerprint: string): Promise<Session> {
        const session = await Session.findByPk(refresh)
        if (!session)
            throw new SessionError("Can't find session with refresh " + refresh)
        if (session.fingerprint !== fingerprint)
            throw new SessionError(`Fingerprint ${ fingerprint } is invalid`)
        if (session.expires < new Date())
            throw new SessionError('Session is expired')
        _.assign(session, {
            expires: createExpires(),
            refresh: createRefresh()
        })
        return session.save()
    },
    async removeOne(refresh: string): Promise<void> {
        await Session.destroy({ where: { refresh } })
    },
    async removeAll(): Promise<void> {
        await Session.destroy({ truncate: true })
    },
    async removeByUserId(userId: number): Promise<void> {
        await Session.destroy({ where: { userId } })
    }
}


export default sessionService
