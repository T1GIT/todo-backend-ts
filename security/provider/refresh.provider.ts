import { HOST } from "../../environment"
import { CookieOptions, Request, Response } from "express"
import config from "../config"
import rootConfig from "../../config"


export const cookieOptions: CookieOptions = {
    domain: `${HOST}`,
    path: `/api/${rootConfig.VERSION}/authorization`,
    maxAge: config.EXPIRE_PERIOD.REFRESH * 24 * 3600 * 1000,
    httpOnly: true,
    sameSite: 'strict',
    signed: true
}

export type RefreshProvider = {
    attach(refresh: string, res: Response): void
    extract(req: Request): string
    erase(res: Response): void
}

const refreshProvider: RefreshProvider = {
    attach(refresh: string, res: Response): void {
        res.cookie("refresh", refresh, cookieOptions)
    },
    extract(req: Request): string {
        return req.signedCookies.refresh
    },
    erase(res: Response): void {
        res.clearCookie("refresh")
    }
}


export default refreshProvider
