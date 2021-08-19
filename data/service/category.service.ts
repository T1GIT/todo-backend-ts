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
    getById(categoryId: number): Promise<Category | null>
    getByUserId(userId: number): Promise<Category[]>
    create(userId: number, category: CategoryForm): Promise<Category>
    update(categoryId: number, category: CategoryForm): Promise<void>
    remove(categoryId: number): Promise<void>
}

const categoryService: CategoryService = {
    getById(categoryId: number): Promise<Category | null> {
        return Category.findByPk(categoryId)
    },
    getByUserId(userId: number): Promise<Category[]> {
        return Category.findAll({
            where: {userId}
        })
    },
    create(userId: number, category: CategoryForm): Promise<Category> {
        return Category.create({
            userId,
            ...category
        })
    },
    async update(categoryId: number, category: CategoryForm): Promise<void> {
        const foundCategory = await Category.findByPk(categoryId)
        _.assign(foundCategory, category)
         await foundCategory.save()
    },
    async remove(categoryId: number): Promise<void> {
        const category = await Category.findByPk(categoryId)
        if (category)
            await category.destroy()
    },
}


export default categoryService
