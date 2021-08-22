import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Model, Table } from "sequelize-typescript"
import Category from "./Category"


export interface TaskAttributes {
    title?: string
    description?: string
    completed: boolean
    executeDate?: Date
    categoryId: number
}

export type TaskCreationAttributes = Omit<TaskAttributes, 'completed'>

export interface TaskAssociations {
    category: Category
}

@Table
class Task
    extends Model<TaskAttributes, TaskCreationAttributes>
    implements TaskAttributes, TaskAssociations {

    @Column
    public title: string | null

    @Column(DataType.TEXT)
    public description: string | null

    @Default(false)
    @AllowNull(false)
    @Column
    public completed: boolean

    @Column
    public executeDate: Date

    @ForeignKey(() => Category)
    @Column
    categoryId!: number

    @BelongsTo(() => Category)
    category!: Category
}


export default Task
