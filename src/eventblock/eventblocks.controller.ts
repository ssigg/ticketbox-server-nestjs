import { Controller, Get, Param, Body, HttpStatus, Session, HttpException, Post, Delete } from "@nestjs/common";
import { EventblocksService } from "./eventblocks.service";
import { MergedEventblock, Eventblock } from "./eventblock.entity";
import { DeleteResult } from "typeorm";

@Controller('eventblocks')
export class EventblocksController {
    constructor(private readonly eventblocksService: EventblocksService) { }

    /**
     * @api {get} /eventsblocks/:key Get one block
     * @apiName GetEventBlock
     * @apiGroup Eventblock
     * @apiPermission none
     * @apiVersion 1.0.0
     * 
     * @apiParam {String} key Block key
     * 
     * @apiSuccess {String} id Block id
     * @apiSuccess {String} name Block name
     * @apiSuccess {String} numbered Is this a numbered block?
     * @apiSuccess {Event} event The event
     * @apiSuccess {Number} event.id Event id
     * @apiSuccess {String} event.location Location name
     * @apiSuccess {String} event.location_address Location address
     * @apiSuccess {String} event.location_directions_public_transport Directions for users of public transport
     * @apiSuccess {String} event.location_directions_car Directions for car drivers
     * @apiSuccess {String} event.dateandtime Textual description of the event date and time
     * @apiSuccess {Boolean} event.visible Visibility of the event
     * @apiSuccess {String} seatplan_image_data_url A Data URI-formatted image of a seat plan
     * @apiSuccess {Part[]} parts Parts of this block
     * @apiSuccess {Number} parts.id Part id
     * @apiSuccess {Category} parts.category Category
     * @apiSuccess {Number} parts.category.id Category id
     * @apiSuccess {String} parts.category.name Category name
     * @apiSuccess {String} parts.category.color Category color
     * @apiSuccess {String} parts.category.price Category price
     * @apiSuccess {String} parts.category.price_reduced Category price (reduced)
     * @apiSuccess {Seat[]} parts.seats Seats of this part
     * @apiSuccess {Seat} parts.seats.seat Seat
     * @apiSuccess {Number} parts.seats.seat.id Seat id
     * @apiSuccess {Number} parts.seats.seat.block_id Seats block id
     * @apiSuccess {String} parts.seats.seat.name Seat name
     * @apiSuccess {Number} parts.seats.seat.x0 Coordinate
     * @apiSuccess {Number} parts.seats.seat.y0 Coordinate
     * @apiSuccess {Number} parts.seats.seat.x1 Coordinate
     * @apiSuccess {Number} parts.seats.seat.y1 Coordinate
     * @apiSuccess {Number} parts.seats.seat.x2 Coordinate
     * @apiSuccess {Number} parts.seats.seat.y2 Coordinate
     * @apiSuccess {Number} parts.seats.seat.x3 Coordinate
     * @apiSuccess {Number} parts.seats.seat.y3 Coordinate
     * @apiSuccess {String} parts.seats.state Seat state (free|reservedbymyself|reserved|sold)
     * @apiSuccess {Number} parts.seats.reservation_id Reservation id
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "id": "10",
     *   "name": "Block One",
     *   "numbered": false,
     *   "event": {
     *       "id": 1,
     *       "name": "Example Event",
     *       "location": "Example Hall",
     *       "location_address": "42 Example Street",
     *       "location_directions_public_transport": "Use the example line",
     *       "location_directions_car": "Turn left, then right.",
     *       "dateandtime": "First sunday in march at 9 am",
     *       "visible": true,
     *   },
     *   "seatplan_image_data_url": "none",
     *   "parts": [
     *       {
     *           "id": "10",
     *           "category": {
     *               "id": 3,
     *               "name": "Block One",
     *               "color": "#000",
     *               "price": 30,
     *               "price_reduced": 20
     *           },
     *           "seats": [
     *               {
     *                   "seat": {
     *                       "id": 77,
     *                       "block_id": 22,
     *                       "name": "Seat One",
     *                       "x0": null,
     *                       "y0": null,
     *                       "x1": null,
     *                       "y1": null,
     *                       "x2": null,
     *                       "y2": null,
     *                       "x3": null,
     *                       "y3": null
     *                   },
     *                   "state": "sold",
     *                   "reservation_id": null
     *               }
     *           ]
     *       }
     *   ]
     * }
     * 
     * @apiError NotFound The eventblock with this key or at least one part of it could not be found.
     * 
     * @apiErrorExample {json} Error-Response:
     * HTTP/1.1 404 Not Found
     * {
     *    "statusCode": 404,
     *    "message": "The eventblock with this key or at least one part of it could not be found."
     * }
     */
    @Get(':key')
    public async find(@Param() params, @Session() session: { token: string }): Promise<MergedEventblock> {
        let mergedEventblock = await this.eventblocksService.getMergedEventblock(params.key, session.token);
        if (mergedEventblock === undefined) {
            throw new HttpException('The eventblock with this key or at least one part of it could not be found.', HttpStatus.NOT_FOUND);
        }
        return mergedEventblock;
    }
}

@Controller('admin/eventblocks')
export class EventblocksAdminController {
    constructor(private readonly eventblocksService: EventblocksService) { }

    /**
     * @api {post} /admin/eventsblocks Create eventblock
     * @apiName CreateEventBlock
     * @apiGroup Eventblock
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiParam {Number} event_id Event id
     * @apiParam {Number} block_id Block id
     * @apiParam {Number} category_id Category id
     * 
     * @apiParamExample {json} Request-Example:
     * {
     *   "event_id": 1,
     *   "block_id": 2,
     *   "category_id": 3
     * }
     * 
     * @apiSuccess (Created 201) {Number} id Eventblock id
     * @apiSuccess (Created 201) {Number} event_id Event id
     * @apiSuccess (Created 201) {Number} block_id Block id
     * @apiSuccess (Created 201) {Number} category_id Category id
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 Created
     * {
     *     "id": 1,
     *     "event_id": 1,
     *     "block_id": 2,
     *     "category_id": 3
     * }
     */
    @Post()
    public async create(@Body() body): Promise<Eventblock> {
        return this.eventblocksService.create(body);
    }

    /**
     * @api {delete} /admin/eventblocks/:id Delete eventblock
     * @apiName DeleteEventblock
     * @apiGroup Eventblock
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiParam {Number} id Eventblock id
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     */
    @Delete()
    public async delete(@Param() param): Promise<DeleteResult> {
        return this.eventblocksService.delete(param.id);
    }
}