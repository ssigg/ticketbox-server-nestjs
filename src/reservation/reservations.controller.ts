import { Controller, Param, Body, Get, Delete, Put, Post, Session, HttpStatus, HttpException } from "@nestjs/common";
import { ReservationsService } from "./reservations.service";
import { Reservation, AugmentedReservation, CreateReservationDto } from "./reservation.entity";
import { Token } from "../utils/token.service";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";

@Controller('reservations')
export class ReservationsController {
    constructor(private readonly reservationsService: ReservationsService) { }
    
    /**
     * @api {get} /reservations List user reservations
     * @apiName ListMyReservations
     * @apiGroup Reservation
     * @apiPermission none
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {Number} id Reservation id
     * @apiSuccess {String} unique_id Reservation's unique id
     * @apiSuccess {Event} event Reservation event
     * @apiSuccess {Number} event.id Event id
     * @apiSuccess {String} event.location Location name
     * @apiSuccess {String} event.location_address Location address
     * @apiSuccess {String} event.location_directions_public_transport Directions for users of public transport
     * @apiSuccess {String} event.location_directions_car Directions for car drivers
     * @apiSuccess {String} event.dateandtime Textual description of the event date and time
     * @apiSuccess {Boolean} event.visible Visibility of the event
     * @apiSuccess {Seat} seat Reservation seat
     * @apiSuccess {Number} seat.id Seat id
     * @apiSuccess {Number} seat.block_id Seats block id
     * @apiSuccess {String} seat.name Seat name
     * @apiSuccess {Number} seat.x0 Coordinate
     * @apiSuccess {Number} seat.y0 Coordinate
     * @apiSuccess {Number} seat.x1 Coordinate
     * @apiSuccess {Number} seat.y1 Coordinate
     * @apiSuccess {Number} seat.x2 Coordinate
     * @apiSuccess {Number} seat.y2 Coordinate
     * @apiSuccess {Number} seat.x3 Coordinate
     * @apiSuccess {Number} seat.y3 Coordinate
     * @apiSuccess {Category} category Reservation category
     * @apiSuccess {Number} category.id Category id
     * @apiSuccess {String} category.name Category name
     * @apiSuccess {String} category.color Category color
     * @apiSuccess {String} category.price Category price
     * @apiSuccess {String} category.price_reduced Category price (reduced)
     * @apiSuccess {Boolean} isReduced Is this reservation reduced?
     * @apiSuccess {Number} price Reservation's price
     * @apiSuccess {Number} order_id Reservation order id (null if not ordered yet)
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *   {
     *     "id": 3869,
     *     "unique_id": "3e51b64c-29e1-11e8-b4f8-002590daa0f6",
     *     "event": {
     *       "id": 1,
     *       "name": "Example Event",
     *       "location": "Example Hall",
     *       "location_address": "42 Example Street",
     *       "location_directions_public_transport": "Use the example line",
     *       "location_directions_car": "Turn left, then right.",
     *       "dateandtime": "First sunday in march at 9 am",
     *       "visible": true,
     *     },
     *     "seat": {
     *        "id": 77,
     *        "block_id": 22,
     *        "name": "Seat One",
     *        "x0": null,
     *        "y0": null,
     *        "x1": null,
     *        "y1": null,
     *        "x2": null,
     *        "y2": null,
     *        "x3": null,
     *        "y3": null
     *     },
     *     "category": {
     *       "id": 3,
     *       "name": "Block One",
     *       "color": "#000",
     *       "price": 30,
     *       "price_reduced": 20
     *     },
     *     "isReduced": false,
     *     "price": 30,
     *     "order_id": null
     *   }
     * ]
     */
    @Get()
    public async findMine(@Session() session: { token: Token }): Promise<AugmentedReservation[]> {
        return this.reservationsService.findMyReservations(session.token);
    }

    /**
     * @api {post} /reservations Reserve a specific seat
     * @apiName ReserveSeat
     * @apiGroup Reservation
     * @apiPermission none
     * @apiVersion 1.0.0
     * 
     * @apiParam {Number} event_id: Event id
     * @apiParam {Number} seat_id: Seat id
     * @apiParam {Number} category_id: Category id
     * 
     * @apiParamExample {json} Request-Example:
     * {
     *   "event_id": 1,
     *   "seat_id": 22,
     *   "category_id": 77
     * }
     * 
     * @apiSuccess (Created 201) {Number} id Reservation id
     * @apiSuccess (Created 201) {String} unique_id Reservation's unique id
     * @apiSuccess (Created 201) {Event} event Reservation event
     * @apiSuccess (Created 201) {Number} event.id Event id
     * @apiSuccess (Created 201) {String} event.location Location name
     * @apiSuccess (Created 201) {String} event.location_address Location address
     * @apiSuccess (Created 201) {String} event.location_directions_public_transport Directions for users of public transport
     * @apiSuccess (Created 201) {String} event.location_directions_car Directions for car drivers
     * @apiSuccess (Created 201) {String} event.dateandtime Textual description of the event date and time
     * @apiSuccess (Created 201) {Boolean} event.visible Visibility of the event
     * @apiSuccess (Created 201) {Seat} seat Reservation seat
     * @apiSuccess (Created 201) {Number} seat.id Seat id
     * @apiSuccess (Created 201) {Number} seat.block_id Seats block id
     * @apiSuccess (Created 201) {String} seat.name Seat name
     * @apiSuccess (Created 201) {Number} seat.x0 Coordinate
     * @apiSuccess (Created 201) {Number} seat.y0 Coordinate
     * @apiSuccess (Created 201) {Number} seat.x1 Coordinate
     * @apiSuccess (Created 201) {Number} seat.y1 Coordinate
     * @apiSuccess (Created 201) {Number} seat.x2 Coordinate
     * @apiSuccess (Created 201) {Number} seat.y2 Coordinate
     * @apiSuccess (Created 201) {Number} seat.x3 Coordinate
     * @apiSuccess (Created 201) {Number} seat.y3 Coordinate
     * @apiSuccess (Created 201) {Category} category Reservation category
     * @apiSuccess (Created 201) {Number} category.id Category id
     * @apiSuccess (Created 201) {String} category.name Category name
     * @apiSuccess (Created 201) {String} category.color Category color
     * @apiSuccess (Created 201) {String} category.price Category price
     * @apiSuccess (Created 201) {String} category.price_reduced Category price (reduced)
     * @apiSuccess (Created 201) {Boolean} isReduced Is this reservation reduced?
     * @apiSuccess (Created 201) {Number} price Reservation's price
     * @apiSuccess (Created 201) {Number} order_id Reservation order id (null if not ordered yet)
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 Created
     * {
     *   "id": 3869,
     *   "unique_id": "3e51b64c-29e1-11e8-b4f8-002590daa0f6",
     *   "event": {
     *     "id": 1,
     *     "name": "Example Event",
     *     "location": "Example Hall",
     *     "location_address": "42 Example Street",
     *     "location_directions_public_transport": "Use the example line",
     *     "location_directions_car": "Turn left, then right.",
     *     "dateandtime": "First sunday in march at 9 am",
     *     "visible": true,
     *   },
     *   "seat": {
     *      "id": 77,
     *      "block_id": 22,
     *      "name": "Seat One",
     *      "x0": null,
     *      "y0": null,
     *      "x1": null,
     *      "y1": null,
     *      "x2": null,
     *      "y2": null,
     *      "x3": null,
     *      "y3": null
     *   },
     *   "category": {
     *     "id": 3,
     *     "name": "Block One",
     *     "color": "#000",
     *     "price": 30,
     *     "price_reduced": 20
     *   },
     *   "isReduced": false,
     *   "price": 30,
     *   "order_id": null
     * }
     * 
     * @apiError (SeatAlreadyReserved) 409 This seat cannot be reserved because a different user has it reserved already.
     * 
     * @apiErrorExample {json} Error-Response:
     * HTTP/1.1 409 Conflict
     */
    @Post()
    public async create(@Body() body, @Session() session: { token: Token }): Promise<AugmentedReservation> {
        try {
            return this.reservationsService.create(body.event_id, body.seat_id, body.category_id, session.token);
        } catch(e) {
            throw new HttpException('This seat cannot be reserved because a different user has it reserved already.', HttpStatus.CONFLICT);
        }
    }

    /**
     * @api {put} /reservations/:id Change reduction
     * @apiName ChangeReduction
     * @apiGroup Reservation
     * @apiPermission none
     * @apiVersion 1.0.0
     * 
     * @apiParam {Number} id Reservation id
     * @apiParam {Boolean} isReduced: New value of the reduction property
     * 
     * @apiParamExample {json} Request-Example:
     * {
     *   "isReduced": true
     * }
     * 
     * @apiSuccess {Number} id Reservation id
     * @apiSuccess {String} unique_id Reservation's unique id
     * @apiSuccess {Event} event Reservation event
     * @apiSuccess {Number} event.id
     * @apiSuccess {String} event.location Location name
     * @apiSuccess {String} event.location_address Location address
     * @apiSuccess {String} event.location_directions_public_transport Directions for users of public transport
     * @apiSuccess {String} event.location_directions_car Directions for car drivers
     * @apiSuccess {String} event.dateandtime Textual description of the event date and time
     * @apiSuccess {Boolean} event.visible Visibility of the event
     * @apiSuccess {Seat} seat Reservation seat
     * @apiSuccess {Number} seat.id Seat id
     * @apiSuccess {Number} seat.block_id Seats block id
     * @apiSuccess {String} seat.name Seat name
     * @apiSuccess {Number} seat.x0 Coordinate
     * @apiSuccess {Number} seat.y0 Coordinate
     * @apiSuccess {Number} seat.x1 Coordinate
     * @apiSuccess {Number} seat.y1 Coordinate
     * @apiSuccess {Number} seat.x2 Coordinate
     * @apiSuccess {Number} seat.y2 Coordinate
     * @apiSuccess {Number} seat.x3 Coordinate
     * @apiSuccess {Number} seat.y3 Coordinate
     * @apiSuccess {Category} category Reservation category
     * @apiSuccess {Number} category.id Category id
     * @apiSuccess {String} category.name Category name
     * @apiSuccess {String} category.color Category color
     * @apiSuccess {String} category.price Category price
     * @apiSuccess {String} category.price_reduced Category price (reduced)
     * @apiSuccess {Boolean} isReduced Is this reservation reduced?
     * @apiSuccess {Number} price Reservation's price
     * @apiSuccess {Number} order_id Reservation order id (null if not ordered yet)
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "id": 3869,
     *   "unique_id": "3e51b64c-29e1-11e8-b4f8-002590daa0f6",
     *   "event": {
     *     "id": 1,
     *     "name": "Example Event",
     *     "location": "Example Hall",
     *     "location_address": "42 Example Street",
     *     "location_directions_public_transport": "Use the example line",
     *     "location_directions_car": "Turn left, then right.",
     *     "dateandtime": "First sunday in march at 9 am",
     *     "visible": true,
     *   },
     *   "seat": {
     *      "id": 77,
     *      "block_id": 22,
     *      "name": "Seat One",
     *      "x0": null,
     *      "y0": null,
     *      "x1": null,
     *      "y1": null,
     *      "x2": null,
     *      "y2": null,
     *      "x3": null,
     *      "y3": null
     *   },
     *   "category": {
     *     "id": 3,
     *     "name": "Block One",
     *     "color": "#000",
     *     "price": 30,
     *     "price_reduced": 20
     *   },
     *   "isReduced": true,
     *   "price": 30,
     *   "order_id": null
     * }
     */
    @Put(':id')
    public async updateReduction(@Param() param, @Body() body, @Session() session: { token: Token }): Promise<AugmentedReservation> {
        return await this.reservationsService.updateReduction(param.id, session.token, body);
    }

    /**
     * @api {delete} /reservations/:id Delete reservation
     * @apiName DeleteReservation
     * @apiGroup Reservation
     * @apiPermission none
     * @apiVersion 1.0.0
     * 
     * @apiParam {Number} id Reservation id
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     */
    @Delete(':id')
    public async delete(@Param() param): Promise<DeleteResult> {
        return await this.reservationsService.delete(param.id);
    }
}

@Controller('reservations-expiration-timestamp')
export class ReservationsExpirationTimestampController {
    constructor() { }

    /**
     * @api {get} /reservations-expiration-timestamp Get reservation expiration timestamp
     * @apiName GetReservationExpirationTimestamp
     * @apiGroup Reservation
     * @apiPermission none
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {Number} value Unix timestamp when reservations will expire
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *   "value": 1521293290
     * }
     */
     @Get()
     public getExpirationTimestamp(@Session() session: { token: Token }): { value: number } {
        return { value: session.token.expirationTimestamp };
     }
}

@Controller('admin/reservations')
export class ReservationsAdminController {
    constructor(private readonly reservationsService: ReservationsService) { }

    /**
     * @api {get} /reservations List all ordered reservations
     * @apiName ListAllOrderedReservations
     * @apiGroup Reservation
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {Number} id Reservation id
     * @apiSuccess {String} unique_id Reservation's unique id
     * @apiSuccess {Event} event Reservation event
     * @apiSuccess {Number} event.id Event id
     * @apiSuccess {String} event.location Location name
     * @apiSuccess {String} event.location_address Location address
     * @apiSuccess {String} event.location_directions_public_transport Directions for users of public transport
     * @apiSuccess {String} event.location_directions_car Directions for car drivers
     * @apiSuccess {String} event.dateandtime Textual description of the event date and time
     * @apiSuccess {Boolean} event.visible Visibility of the event
     * @apiSuccess {Seat} seat Reservation seat
     * @apiSuccess {Number} seat.id Seat id
     * @apiSuccess {Number} seat.block_id Seats block id
     * @apiSuccess {String} seat.name Seat name
     * @apiSuccess {Number} seat.x0 Coordinate
     * @apiSuccess {Number} seat.y0 Coordinate
     * @apiSuccess {Number} seat.x1 Coordinate
     * @apiSuccess {Number} seat.y1 Coordinate
     * @apiSuccess {Number} seat.x2 Coordinate
     * @apiSuccess {Number} seat.y2 Coordinate
     * @apiSuccess {Number} seat.x3 Coordinate
     * @apiSuccess {Number} seat.y3 Coordinate
     * @apiSuccess {Category} category Reservation category
     * @apiSuccess {Number} category.id Category id
     * @apiSuccess {String} category.name Category name
     * @apiSuccess {String} category.color Category color
     * @apiSuccess {String} category.price Category price
     * @apiSuccess {String} category.price_reduced Category price (reduced)
     * @apiSuccess {Boolean} isReduced Is this reservation reduced?
     * @apiSuccess {Number} price Reservation's price
     * @apiSuccess {Number} order_id Reservation order id (null if not ordered yet)
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *   {
     *     "id": 3869,
     *     "unique_id": "3e51b64c-29e1-11e8-b4f8-002590daa0f6",
     *     "event": {
     *       "id": 1,
     *       "name": "Example Event",
     *       "location": "Example Hall",
     *       "location_address": "42 Example Street",
     *       "location_directions_public_transport": "Use the example line",
     *       "location_directions_car": "Turn left, then right.",
     *       "dateandtime": "First sunday in march at 9 am",
     *       "visible": true,
     *     },
     *     "seat": {
     *        "id": 77,
     *        "block_id": 22,
     *        "name": "Seat One",
     *        "x0": null,
     *        "y0": null,
     *        "x1": null,
     *        "y1": null,
     *        "x2": null,
     *        "y2": null,
     *        "x3": null,
     *        "y3": null
     *     },
     *     "category": {
     *       "id": 3,
     *       "name": "Block One",
     *       "color": "#000",
     *       "price": 30,
     *       "price_reduced": 20
     *     },
     *     "isReduced": false,
     *     "price": 30,
     *     "order_id": 1
     *   }
     * ]
     */
    @Get()
    public async findAllOrdered(): Promise<AugmentedReservation[]> {
        return this.reservationsService.findAllOrderedReservations();
    }
}