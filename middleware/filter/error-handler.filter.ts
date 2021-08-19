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
    msg: string,
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
        msg: 'Request validation error',
        fields: result.formatWith(formatter).mapped()
    }
}

function createRuntimeError(err: (Error | HttpError) & {code?: number}): ResponseError {
    let code: number
    if (err instanceof HttpError) {
        code = err.code
    } else if (err instanceof JsonWebTokenError) {
        code = 401
    } else if (err.name === 'ValidationError') {
        code = 422
    } else {
        logger.error(err.stack.split('\n'))
        code = 500
    }
    const { name, message, stack } = err
    return {
        code, name,
        msg: message,
        trace: NODE_ENV !== 'production'
            ? stack.split('\n')
            : undefined
    }
}


function errorHandlerFilter(handler: RequestHandler) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validation = validationResult(req)
            if (validation.isEmpty()) {
                await handler(req, res, next)
            } else {
                next(createValidationError(validation))
            }
        } catch (e) {
            next(createRuntimeError(e))
        }
    }
}


module.exports = errorHandlerFilter
