import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { BlocksService } from './blocks.service';
import { Block, ThinBlock } from './block.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

@Controller('admin/blocks')
export class BlocksAdminController {
    constructor(private readonly blocksService: BlocksService) { }

    /**
     * @api {get} /admin/blocks Get all raw blocks
     * @apiName GetBlocks
     * @apiGroup Block
     * @apiPermission admin
     * @apiVersion 1.0.0
     *
     * @apiSuccess {Number} id Block id
     * @apiSuccess {String} name Block name
     * @apiSuccess {Boolean} numbered Is this a numbered block?
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "id": 1,
     *         "name": "Example Block",
     *         "numbered": true
     *     }
     * ]
     */
    @Get()
    public findAll(): Promise<ThinBlock[]> {
        return this.blocksService.findAll();
    }

    /**
     * @api {get} /admin/blocks/:id Get one raw block
     * @apiName GetBlock
     * @apiGroup Block
     * @apiPermission admin
     * @apiVersion 1.0.0
     *
     * @apiSuccess {Number} id Block id
     * @apiSuccess {String} name Block name
     * @apiSuccess {Boolean} numbered Is this a numbered block?
     * @apiSuccess {String} seatplan_image_data_url A Data URI-formatted image of a seat plan or "none" for unnumbered blocks
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "id": 1,
     *     "name": "Example Block",
     *     "numbered": true,
     *     "seatplan_image_data_url": "<Data URI string>"
     * }
     */
    @Get(':id')
    public find(@Param() params): Promise<Block> {
        return this.blocksService.find(params.id);
    }

    /**
     * @api {post} /admin/blocks Create raw block
     * @apiName CreateBlock
     * @apiGroup Block
     * @apiPermission admin
     * @apiVersion 1.0.0
     *
     * @apiParam {String} name Block name
     * @apiParam {Boolean} numbered Is this a numbered block?
     * @apiParam {String} [seatplan_image_data_url] A Data URI-formatted image of a seat plan
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "name": "Example Block"
     *   "numbered": true,
     *   "seatplan_image_data_url": "<Data URI string>"
     * }
     *
     * @apiSuccess (Created 201) {Number} id Block id
     * @apiSuccess (Created 201) {String} name Block name
     * @apiSuccess (Created 201) {Boolean} numbered Is this a numbered block?
     * @apiSuccess (Created 201) {String} seatplan_image_data_url A Data URI-formatted image of a seat plan or "none" for unnumbered blocks
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 Created
     * {
     *     "id": 1,
     *     "name": "Example Block",
     *     "numbered": true,
     *     "seatplan_image_data_url": "<Data URI string>"
     * }
     */
    @Post()
    public create(@Body() body): Promise<Block> {
        return this.blocksService.create(body);
    }

    /**
     * @api {put} /admin/blocks/:id Update raw block
     * @apiName UpdateBlock
     * @apiGroup Block
     * @apiPermission admin
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} id Block id
     * @apiParam {String} name Block name
     * @apiParam {Boolean} numbered Is this a numbered block?
     * @apiParam {String} [seatplan_image_data_url] A Data URI-formatted image of a seat plan
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "name": "Example Block"
     *   "numbered": true,
     *   "seatplan_image_data_url": "<Data URI string>"
     * }
     *
     * @apiSuccess {Number} id Block id
     * @apiSuccess {String} name Block name
     * @apiSuccess {Boolean} numbered Is this a numbered block?
     * @apiSuccess {String} seatplan_image_data_url A Data URI-formatted image of a seat plan or "none" for unnumbered blocks
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "id": 1,
     *     "name": "Example Block",
     *     "numbered": true,
     *     "seatplan_image_data_url": "<Data URI string>"
     * }
     */
    @Put(':id')
    public update(@Param() params, @Body() body): Promise<Block> {
        return this.blocksService.update(params.id, body);
    }

    /**
     * @api {delete} /admin/blocks/:id Delete raw block
     * @apiName DeleteBlock
     * @apiGroup Block
     * @apiPermission admin
     * @apiVersion 1.0.0
     *
     * @apiParam {Number} id Block id
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     */
    @Delete(':id')
    public delete(@Param() params): Promise<DeleteResult> {
        return this.blocksService.delete(params.id);
    }
}