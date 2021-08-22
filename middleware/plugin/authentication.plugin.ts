import jwtProvider, { Payload } from "../../security/provider/jwt.provider"
import { NextFunction, Request, Response } from "express"
import * as core from "express-serve-static-core"


export interface AuthRequest<ReqBody = any, ReqQuery = any> extends Request<any, any, ReqBody, ReqQuery> {
    readonly auth: Payload
}

const authenticationPlugin = async (req: Request & {auth: Payload}, res: Response, next: NextFunction) => {
    try {
        req.auth = await jwtProvider.extract(req)
        next()
    } catch (e) {
        next(e)
    }
}


export default authenticationPlugin
