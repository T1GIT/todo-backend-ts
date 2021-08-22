import { ResponseError } from "../filter/error-handler.filter"
import { NextFunction, Request, Response } from "express"
import { NODE_ENV } from "../../environment"


const errorHandlerPlugin = async (
    error: ResponseError,
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    res.status(error.code).json({error})
}


export default errorHandlerPlugin
