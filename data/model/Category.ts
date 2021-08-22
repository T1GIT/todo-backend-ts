import { BelongsTo, Column, ForeignKey, HasMany, Model, Table } from "sequelize-typescript"
import Task from "./Task"
import User from "./User"


export interface CategoryAttributes {
    name?: string
    userId: number
}

export interface CategoryAssociations {
    tasks: Task[]
    user: User
}

@Table
class Category
    extends Model<CategoryAttributes>
    implements CategoryAttributes, CategoryAssociations {

    @Column
    public name: string | null

    @HasMany(() => Task)
    public tasks: Task[]

    @ForeignKey(() => User)
    @Column
    userId!: number

    @BelongsTo(() => User)
    user!: User
}


export default Category
