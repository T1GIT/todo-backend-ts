export class HttpError extends Error {
    public code!: number

    constructor(code: number, name: string, msg: string) {
        super(msg)
        this.code = code
        this.name = name
    }
}

export class NotFound extends HttpError {
    constructor(stuff: string) {
        super(404, 'NotFound', `${stuff} not found`)
    }
}

export class EmailAlreadyExists extends HttpError {
    constructor(email: string) {
        super(409, 'EmailAlreadyExists', `${email} already exists`)
    }
}

export class EmailNotExists extends HttpError {
    constructor(email: string) {
        super(404, 'EmailNotExists', `${email} not found`)
    }
}

export class WrongPsw extends HttpError {
    constructor(psw: string) {
        super(401, 'WrongPsw', `${psw} is wrong`)
    }
}

export class SessionError extends HttpError {
    constructor(msg: string) {
        super(401, 'SessionError', msg)
    }
}

export class AdminRights extends HttpError {
    constructor(msg: string) {
        super(403, 'AdminRights', msg)
    }
}
