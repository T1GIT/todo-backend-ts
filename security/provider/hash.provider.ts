import config from "../config"
import { compareSync, hashSync } from "bcrypt"


export type HashProvider = {
    hash(psw: string): Promise<string>
    isValid(psw: string, hash: string): Promise<boolean>
}

const hashProvider: HashProvider = {
    async hash(psw: string): Promise<string> {
        return hashSync(psw, config.KEY_LENGTH.SALT)
    },
    async isValid(psw: string, hash: string): Promise<boolean> {
        return compareSync(psw, hash)
    },
}


export default hashProvider
