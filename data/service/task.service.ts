import Session from "../model/Session"
import securityConfig from "../../security/config"
import { nanoid } from "nanoid"
import { Op, fn } from "sequelize"
import config from "../config"
import { SessionError } from "../../util/http-error"
import _ from "lodash"
import Category, { CategoryAttributes } from "../model/Category"
import Task from "../model/Task"


export type TaskForm = Pick<Task, 'title' | 'description' | 'completed'>

export type TaskService = {
    getById(categoryId: number): Promise<Task | null>
    getByCategoryId(userId: number): Promise<Task[]>
    create(categoryId: number, task: TaskForm): Promise<Task>
    update(taskId: number, task: TaskForm): Promise<void>
    remove(taskId: number): Promise<void>
}

const taskService: TaskService = {
    getById(taskId: number): Promise<Task | null> {
        return Task.findByPk(taskId)
    },
    getByCategoryId(categoryId: number): Promise<Task[]> {
        return Task.findAll({
            where: {categoryId}
        })
    },
    create(categoryId: number, task: TaskForm): Promise<Task> {
        return Task.create({
            categoryId,
            ...task
        })
    },
    async update(taskId: number, task: TaskForm): Promise<void> {
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
