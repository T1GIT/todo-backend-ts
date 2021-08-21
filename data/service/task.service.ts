import Session from "../model/Session"
import securityConfig from "../../security/config"
import { nanoid } from "nanoid"
import { Op, fn } from "sequelize"
import config from "../config"
import { SessionError } from "../../util/http-error"
import _ from "lodash"
import Category, { CategoryAttributes } from "../model/Category"
import Task from "../model/Task"


export type TaskCreateForm = Pick<Task, 'title' | 'description'>

export type TaskUpdateForm = Pick<Task, 'title' | 'description' | 'completed'>

export type TaskService = {
    existsByCategoryIdAndId(categoryId: number, taskId: number): Promise<boolean>
    getById(categoryId: number): Promise<Task | null>
    getByCategoryId(userId: number, offset?: number, limit?: number): Promise<Task[]>
    create(categoryId: number, task: TaskUpdateForm): Promise<Task>
    update(taskId: number, task: TaskUpdateForm): Promise<void>
    remove(taskId: number): Promise<void>
}

const taskService: TaskService = {
    async existsByCategoryIdAndId(categoryId: number, taskId: number): Promise<boolean> {
        const task = await Task.findByPk(taskId)
        if (task) {
            return task.categoryId === categoryId
        } else {
            return false
        }
    },
    getById(taskId: number): Promise<Task | null> {
        return Task.findByPk(taskId)
    },
    getByCategoryId(categoryId: number, offset: number = 0, limit: number = Infinity): Promise<Task[]> {
        return Task.findAll({
            where: {categoryId},
            offset, limit
        })
    },
    create(categoryId: number, task: TaskCreateForm): Promise<Task> {
        return Task.create({
            categoryId,
            ...task
        })
    },
    async update(taskId: number, task: TaskUpdateForm): Promise<void> {
        const {completed} = task
        const foundTask = await Task.findByPk(taskId)
        _.assign(foundTask, task)
        if (!_.isUndefined(completed))
            foundTask.executeDate = completed
                ? new Date()
                : null
        await foundTask.save()
    },
    async remove(taskId: number): Promise<void> {
        const task = await Task.findByPk(taskId)
        if (task)
            await task.destroy()
    }
}


export default taskService
