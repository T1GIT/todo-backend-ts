import { Location, Result, ValidationError, validationResult } from "express-validator"
import { NODE_ENV } from "../../environment"
import _ from "lodash"
import { HttpError } from "../../util/http-error"
import { NextFunction, Request, RequestHandler, Response } from "express"
import { JsonWebTokenError } from "jsonwebtoken"
import logger from "../../util/logger"



export type FieldError = {
    value?: string,
    msg: string,
    location?: Location
}

export type ResponseError = {
    code: number,
    name: string,
    message: string,
    fields?: Record<string, FieldError>,
    trace?: string[]
}

export function formatter(err: ValidationError): FieldError {
    return _.pick(err, 'value', 'msg', 'location')
}

function createValidationError(result: Result<FieldError>): ResponseError {
    return {
        code: 400,
        name: 'ValidationError',
        message: 'Request validation error',
        fields: result.formatWith(formatter).mapped()
    }
}

function createRuntimeError(e: (Error | HttpError) & {code?: number}): ResponseError {
    if (NODE_ENV !== 'production')
        console.error(e)
    let code: number
    if (e instanceof HttpError) {
        code = e.code
    } else if (e instanceof JsonWebTokenError) {
        code = 401
    } else if (e.name === 'ValidationError') {
        code = 422
    } else {
        logger.error(e.stack.split('\n'))
        code = 500
    }
    const { name, message, stack } = e
    return {
        code, name, message,
        trace: NODE_ENV !== 'production'
            ? stack.split('\n')
            : undefined
    }
}


function errorHandlerFilter(handler: (req: Request, res: Response) => any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validation = validationResult(req)
            if (validation.isEmpty()) {
                await handler(req, res)
            } else {
                next(createValidationError(validation))
            }
        } catch (e) {
            next(createRuntimeError(e))
        }
    }
}


export default errorHandlerFilter
