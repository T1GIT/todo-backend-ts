import User from "../model/User"
import { EmailAlreadyExists, EmailNotExists, WrongPsw } from "../../util/http-error"
import hashProvider from "../../security/provider/hash.provider"
import _ from "lodash"


function findByEmail(email: string): Promise<User | null> {
    return User.findOne({where: {email}})
}

export type RegisterForm = Pick<User,
    'email' | 'psw' | 'name' | 'surname' | 'patronymic' | 'birthdate' | 'role'>

export type LoginForm = Pick<User,
    'email' | 'psw'>

export type UpdateForm = Partial<RegisterForm>

export type UserService = {
    existsById(userId: number): Promise<boolean>
    getById(userId: number): Promise<User | null>
    create(user: RegisterForm): Promise<User>
    authorize(user: LoginForm): Promise<User>
    update(userId: number, user: UpdateForm): Promise<void>
    remove(userId: number): Promise<void>
}

const userService: UserService = {
    async existsById(userId: number): Promise<boolean> {
        return !!await User.findByPk(userId) !== null
    },
    getById(userId: number): Promise<User | null> {
        return User.findByPk(userId)
    },
    async create(user: RegisterForm): Promise<User> {
        const {email, psw} = user
        if (await findByEmail(email))
            throw new EmailAlreadyExists(email)
        user.psw = await hashProvider.hash(psw)
        return User.create(user)
    },
    async authorize(user: LoginForm): Promise<User> {
        const {email, psw} = user
        const foundUser = await findByEmail(email)
        if (!foundUser)
            throw new EmailNotExists(email)
        if (!await hashProvider.isValid(psw, foundUser.psw))
            throw new WrongPsw(psw)
        return foundUser
    },
    async update(userId: number, user: UpdateForm): Promise<void> {
        const {email, psw} = user
        if (email && await findByEmail(email))
            throw new EmailAlreadyExists(email)
        const foundUser = await User.findByPk(userId)
        _.assign(foundUser, user)
        if (psw)
            foundUser.psw = await hashProvider.hash(psw)
        await foundUser.save()
    },
    async remove(userId: number): Promise<void> {
        const foundUser = await User.findByPk(userId)
        if (foundUser)
            await foundUser.destroy()
    }
}


export default userService
