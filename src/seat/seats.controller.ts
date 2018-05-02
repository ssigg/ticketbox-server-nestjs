import { Controller, Get, Post, Delete, Query, Body, Param } from "@nestjs/common";
import { SeatsService } from "./seats.service";
import { Seat } from "./seat.entity";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";

@Controller('admin/seats')
export class SeatsAdminController {
    constructor(private readonly seatsService: SeatsService) { }

    /**
     * @api {get} /admin/seats Get all seats of a block
     * @apiName GetSeats
     * @apiGroup Seat
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {Number} id Seat id
     * @apiSuccess {String} name Seat name
     * @apiSuccess {Number} x0 Coordinate
     * @apiSuccess {Number} y0 Coordinate
     * @apiSuccess {Number} x1 Coordinate
     * @apiSuccess {Number} y1 Coordinate
     * @apiSuccess {Number} x2 Coordinate
     * @apiSuccess {Number} y2 Coordinate
     * @apiSuccess {Number} x3 Coordinate
     * @apiSuccess {Number} y3 Coordinate
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "id": 77,
     *         "block_id": 22,
     *         "name": "Seat One",
     *         "x0": null,
     *         "y0": null,
     *         "x1": null,
     *         "y1": null,
     *         "x2": null,
     *         "y2": null,
     *         "x3": null,
     *         "y3": null
     *     }
     * ]
     */
    @Get()
    public findAll(@Query() query): Promise<Seat[]> {
        return this.seatsService.findAllInBlock(query.block_id);
    }

    /**
     * @api {post} /admin/seats Create seats
     * @apiName CreateSeats
     * @apiGroup Seat
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiParam {String} name Seat name
     * @apiParam {Number} x0 Coordinate
     * @apiParam {Number} y0 Coordinate
     * @apiParam {Number} x1 Coordinate
     * @apiParam {Number} y1 Coordinate
     * @apiParam {Number} x2 Coordinate
     * @apiParam {Number} y2 Coordinate
     * @apiParam {Number} x3 Coordinate
     * @apiParam {Number} y3 Coordinate
     * 
     * @apiParamExample {json} Request-Example:
     * [
     *     {
     *         "id": 77,
     *         "block_id": 22,
     *         "name": "Seat One",
     *         "x0": null,
     *         "y0": null,
     *         "x1": null,
     *         "y1": null,
     *         "x2": null,
     *         "y2": null,
     *         "x3": null,
     *         "y3": null
     *     }
     * ]
     * 
     * @apiSuccess (Created 201) {Number} id Seat id
     * @apiSuccess (Created 201) {String} name Seat name
     * @apiSuccess (Created 201) {Number} x0 Coordinate
     * @apiSuccess (Created 201) {Number} y0 Coordinate
     * @apiSuccess (Created 201) {Number} x1 Coordinate
     * @apiSuccess (Created 201) {Number} y1 Coordinate
     * @apiSuccess (Created 201) {Number} x2 Coordinate
     * @apiSuccess (Created 201) {Number} y2 Coordinate
     * @apiSuccess (Created 201) {Number} x3 Coordinate
     * @apiSuccess (Created 201) {Number} y3 Coordinate
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 Created
     * [
     *     {
     *         "id": 77,
     *         "block_id": 22,
     *         "name": "Seat One",
     *         "x0": null,
     *         "y0": null,
     *         "x1": null,
     *         "y1": null,
     *         "x2": null,
     *         "y2": null,
     *         "x3": null,
     *         "y3": null
     *     }
     * ]
     */
    @Post()
    public create(@Body() body): Promise<Seat[]> {
        return this.seatsService.create(body);
    }

    /**
     * @api {delete} /admin/seats/:id Delete seat
     * @apiName DeleteSeat
     * @apiGroup Seat
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiParam {Number} id Seat id
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     */
    @Delete(':id')
    public delete(@Param() params): Promise<DeleteResult> {
        return this.seatsService.delete(params.id);
    }
}