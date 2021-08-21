import { AuthRequest } from "../../middleware/plugin"
import { NextFunction, Response } from "express"
import categoryService from "../../data/service/category.service"
import _ from "lodash"
import { NotFound } from "../../util/http-error"


const fields = ['name']

export type CategoryTool = Record<'exists',
    (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>>

export const categoryTool: CategoryTool = {
    async exists(req: AuthRequest, res: Response, next: NextFunction) {
        const { auth: {userId} } = req
        const { categoryId } = req.params
        if (!await categoryService.existsByUserIdAndId(userId, parseInt(categoryId)))
            next(new NotFound(`category with id ${categoryId}`))
        else {
            next()
        }
    }
}

export type CategoryRequests = 'getOne' | 'getAll' | 'create' | 'update' | 'remove'

export type CategoryController = Record<CategoryRequests,
    (req: AuthRequest, res: Response) => Promise<void>>

export type GetAllReqQuery = {
    offset?: number
    limit?: number
}

const categoryController: CategoryController = {
    async getOne(req, res) {
        const { categoryId } = req.params
        const category = await categoryService.getById(parseInt(categoryId))
        res.status(200).json(category)
    },
    async getAll(req: AuthRequest<any, GetAllReqQuery>, res) {
        const { auth: {userId} } = req
        const { offset=0, limit=Infinity } = req.query
        const categories = await categoryService.getByUserId(userId, offset, limit)
        res.status(200).json({
            total: categories.length,
            offset, categories
        })
    },
    async create(req, res) {
        const { auth: {userId} } = req
        const category: any = _.pick(req.body, fields)
        const categoryId = await categoryService.create(userId, category)
        res.header('Location', `categories/${ categoryId }`).sendStatus(201)
    },
    async update(req, res) {
        const { categoryId } = req.params
        const category: any = _.pick(req.body, fields)
        await categoryService.update(categoryId, category)
        res.sendStatus(204)
    },
    async remove(req, res) {
        const { categoryId } = req.params
        await categoryService.remove(categoryId)
        res.sendStatus(204)
    }
}


export default categoryController
