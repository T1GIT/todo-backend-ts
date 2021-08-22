import { AllowNull, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table, Unique, UpdatedAt } from "sequelize-typescript"
import config from "../../security/config"
import User from "./User"


export interface SessionAttributes {
    refresh: string
    readonly fingerprint: string
    expires: Date
    userId: number
}

export interface SessionsAssociations {
    user: User
}

@Table
class Session
    extends Model<SessionAttributes>
    implements SessionAttributes, SessionsAssociations {
    @PrimaryKey
    @Column
    public refresh!: string

    @AllowNull(false)
    @Column
    public readonly fingerprint!: string

    @Column
    public expires!: Date

    @ForeignKey(() => User)
    @Column
    userId!: number

    @BelongsTo(() => User)
    user!: User
}


export default Session
