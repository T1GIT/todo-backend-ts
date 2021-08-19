import { Table, Column, HasMany, Index, Unique, DataType, Default, AllowNull, Model } from "sequelize-typescript";
import Session from "./Session";
import _ from "lodash"
import Category from "./Category"


export enum Role {
    BASIC = "BASIC",
    ADMIN = "ADMIN"
}

export interface UserAttributes {
    email: string
    psw: string
    name?: string
    surname?: string
    patronymic?: string
    birthdate?: Date
    role: Role
}

export type UserCreationAttributes = Omit<UserAttributes, 'role'>

export interface UserAssociations {
    sessions: Session[]
    categories: Category[]
}

@Table
class User
    extends Model<UserAttributes, UserCreationAttributes>
    implements UserAttributes, UserAssociations
{
    @AllowNull(false)
    @Index
    @Unique
    @Column
    public email!: string

    @AllowNull(false)
    @Column
    public psw!: string

    @Column
    public name: string | null

    @Column
    public surname: string | null

    @Column
    public patronymic: string | null

    @Column
    public birthdate: Date | null

    @AllowNull(false)
    @Default(Role.BASIC)
    @Column(DataType.ENUM(..._.values(Role)))
    public role: Role

    @HasMany(() => Session)
    public sessions: Session[]

    @HasMany(() => Category)
    public categories: Category[]
}


export default User
