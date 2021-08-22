import { Request } from "express"
import { JsonWebTokenError, JwtPayload, sign, verify } from "jsonwebtoken"
import { JWT_SECRET } from '../../environment'
import config from "../config"


export interface Payload extends JwtPayload {
    userId: number
}

export type JwtProvider = {
    create(payload: Payload): Promise<string>
    extract(req: Request): Promise<Payload>
}

const jwtProvider: JwtProvider = {
    async create (payload: Payload): Promise<string> {
        return sign(payload, JWT_SECRET, {
            expiresIn: config.EXPIRE_PERIOD.JWT * 60
        })
    },
    async extract (req: Request): Promise<Payload> {
        const authorization = req.header('authorization')
        if (!authorization)
            throw new JsonWebTokenError("can't find bearer authorization token")
        const jwt = authorization.slice(7)
        // @ts-ignore
        return verify(jwt, JWT_SECRET)
    },
}


export default jwtProvider
