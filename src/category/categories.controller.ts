import { Controller, Get, Post, Put, Delete , Param, Body} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { Category } from "./category.entity";

@Controller('admin/categories')
export class CategoriesAdminController {
    constructor(private readonly categoriesService: CategoriesService) { }

    /**
     * @api {get} /admin/categories Get all categories
     * @apiName GetCategories
     * @apiGroup Category
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {Number} id Category id
     * @apiSuccess {String} name Category name
     * @apiSuccess {String} color Category color
     * @apiSuccess {Number} price Normal price
     * @apiSuccess {Number} price_reduced Reduced price
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "id": 1,
     *         "name": "Example Category",
     *         "color": "#f33",
     *         "price": 20,
     *         "price_reduced": 10
     *     }
     * ]
     */
    @Get()
    public findAll(): Promise<Category[]> {
        return this.categoriesService.findAll();
    }

    /**
     * @api {get} /admin/categories/:id Get one category
     * @apiName GetCategory
     * @apiGroup Category
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {Number} id Category id
     * @apiSuccess {String} name Category name
     * @apiSuccess {String} color Category color
     * @apiSuccess {Number} price Normal price
     * @apiSuccess {Number} price_reduced Reduced price
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "id": 1,
     *     "name": "Example Category",
     *     "color": "#f33",
     *     "price": 20,
     *     "price_reduced": 10
     * }
     */
    @Get(':id')
    public find(@Param() params): Promise<Category> {
        return this.categoriesService.find(params.id);
    }

    /**
     * @api {post} /admin/categories Create category
     * @apiName CreateCategory
     * @apiGroup Category
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiParam {String} name Category name
     * @apiParam {String} [color] Category color
     * @apiParam {Number} price Normal price
     * @apiParam {Number} price_reduced Reduced price
     * 
     * @apiParamExample {json} Request-Example:
     * {
     *   "name": "Example Category",
     *   "color": "#f33",
     *   "price" 20,
     *   "price_reduced": 10
     * }
     * 
     * @apiSuccess (Created 201) {Number} id Category id
     * @apiSuccess (Created 201) {String} name Category name
     * @apiSuccess (Created 201) {String} color Category color
     * @apiSuccess (Created 201) {Number} price Normal price
     * @apiSuccess (Created 201) {Number} price_reduced Reduced price
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 Created
     * {
     *     "id": 1,
     *     "name": "Example Category",
     *     "color": "#f33",
     *     "price": 20,
     *     "price_reduced": 10
     * }
     */
    @Post()
    public create(@Body() body): Promise<Category> {
        return this.categoriesService.create(body);
    }

    /**
     * @api {put} /admin/categories/:id Update category
     * @apiName UpdateCategory
     * @apiGroup Category
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiParam {String} name Category name
     * @apiParam {String} [color] Category color
     * @apiParam {Number} price Normal price
     * @apiParam {Number} price_reduced Reduced price
     * 
     * @apiParamExample {json} Request-Example:
     * {
     *   "name": "Example Category",
     *   "color": "#f33",
     *   "price" 20,
     *   "price_reduced": 10
     * }
     * 
     * @apiSuccess {Number} id Category id
     * @apiSuccess {String} name Category name
     * @apiSuccess {String} color Category color
     * @apiSuccess {Number} price Normal price
     * @apiSuccess {Number} price_reduced Reduced price
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "id": 1,
     *     "name": "Example Category",
     *     "color": "#f33",
     *     "price": 20,
     *     "price_reduced": 10
     * }
     */
    @Put(':id')
    public update(@Param() params, @Body() body): Promise<Category> {
        return this.categoriesService.update(params.id, body);
    }

    /**
     * @api {delete} /admin/categories/:id Delete category
     * @apiName DeleteCategory
     * @apiGroup Category
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiParam {Number} id Category id
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     */
    @Delete(':id')
    public delete(@Param() params): Promise<void> {
        return this.categoriesService.delete(params.id);
    }
}