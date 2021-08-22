import Session from "../model/Session"
import securityConfig from "../../security/config"
import { nanoid } from "nanoid"
import { Op, fn } from "sequelize"
import config from "../config"
import { SessionError } from "../../util/http-error"
import _ from "lodash"
import Category, { CategoryAttributes } from "../model/Category"


export type CategoryForm = Pick<Category, 'name'>

export type CategoryService = {
    existsByUserIdAndId(userId: number, categoryId: number): Promise<boolean>
    getById(categoryId: number): Promise<Category | null>
    getByUserId(userId: number, offset: number, limit: number): Promise<Category[]>
    create(userId: number, category: CategoryForm): Promise<Category>
    update(categoryId: number, category: CategoryForm): Promise<void>
    remove(categoryId: number): Promise<void>
}

const categoryService: CategoryService = {
    async existsByUserIdAndId(userId, categoryId) {
        const category = await Category.findByPk(categoryId)
        if (category)
            return category.userId === userId
        else
            return false
    },
    getById(categoryId) {
        return Category.findByPk(categoryId)
    },
    getByUserId(userId, offset = 0, limit = Infinity) {
        return Category.findAll({
            where: { userId },
            offset, limit
        })
    },
    create(userId, category) {
        return Category.create({
            userId,
            ...category
        })
    },
    async update(categoryId, category) {
        const foundCategory = await Category.findByPk(categoryId)
        _.assign(foundCategory, category)
        await foundCategory.save()
    },
    async remove(categoryId) {
        const category = await Category.findByPk(categoryId)
        if (category)
            await category.destroy()
    }
}


export default categoryService
