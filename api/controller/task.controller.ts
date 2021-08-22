import { NextFunction, Response } from "express"
import taskService from "../../data/service/task.service"
import { NotFound } from "../../util/http-error"
import categoryService from "../../data/service/category.service"
import _ from "lodash"
import { AuthRequest } from "../../middleware/plugin/authentication.plugin"


const createFields = ['title', 'description']
const updateFields = [...createFields, 'completed']


export type TaskTool = Record<'exists',
    (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>>

export const taskTool: TaskTool = {
    async exists(req, res, next) {
        const { auth: { userId } } = req
        const { categoryId, taskId } = req.params
        if (!await categoryService.existsByUserIdAndId(userId, categoryId))
            next(new NotFound(`Category with id ${ categoryId }`))
        if (!await taskService.existsByCategoryIdAndId(categoryId, taskId))
            next(new NotFound(`Task with id ${ taskId }`))
        else {
            next()
        }
    }
}

export type TaskRequests = 'getOne' | 'getAll' | 'create' | 'update' | 'remove'

export type TaskController = Record<TaskRequests,
    (req: AuthRequest, res: Response) => Promise<void>>

export type GetAllReqQuery = {
    offset?: number
    limit?: number
}

const taskController: TaskController = {
    async getOne(req, res) {
        const { taskId } = req.params
        const task = await taskService.getById(taskId)
        res.status(200).json(task)
    },
    async getAll(req: AuthRequest<any, GetAllReqQuery>, res) {
        const { categoryId } = req.params
        const { offset = 0, limit = Infinity } = req.query
        const tasks = await taskService.getByCategoryId(categoryId, offset, limit)
        res
            .status(200)
            .json({
                total: tasks.length,
                offset, tasks
            })
    },
    async create(req, res) {
        const { categoryId } = req.params
        const task: any = _.pick(req.body, updateFields)
        const taskId = await taskService.create(categoryId, task)
        res
            .header('Location', `categories/${ categoryId }/tasks/${ taskId }`)
            .sendStatus(201)
    },
    async update(req, res) {
        const { taskId } = req.params
        const task: any = _.pick(req.body, updateFields)
        await taskService.update(taskId, task)
        res.sendStatus(204)
    },
    async remove(req, res) {
        const { taskId } = req.params
        await taskService.remove(taskId)
        res.sendStatus(204)
    }
}


export default taskController
