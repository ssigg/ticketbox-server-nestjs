import { Controller, Post, Body, HttpStatus, HttpException } from '@nestjs/common';
import { BasketService } from '../reservation/basket.service';
import { OrderDto } from './order.entity';

@Controller('orders')
export class OrdersController {
    constructor(private readonly basketService: BasketService) { }

    /**
     * @api {post} /orders Create an order
     * @apiName CreateOrder
     * @apiGroup Order
     * @apiPermission none
     * @apiVersion 1.0.0
     *
     * @apiParam {String} title Customer title
     * @apiParam {String} firstname Customer firstname
     * @apiParam {String} lastname Customer lastname
     * @apiParam {String} email Customer email
     * @apiParam {String} locale Customer locale
     *
     * @apiParamExample {json} Request-Example:
     * {
     *   "title": "m",
     *   "firstname": "John",
     *   "lastname": "Doe",
     *   "email": "john.doe@example.com",
     *   "locale": "en"
     * }
     *
     * @apiSuccess (Created 201) {Number} id Order id
     * @apiSuccess (Created 201) {String} unique_id Unique order id
     * @apiSuccess (Created 201) {String} title Customer title
     * @apiSuccess (Created 201) {String} firstname Customer firstname
     * @apiSuccess (Created 201) {String} lastname Customer lastname
     * @apiSuccess (Created 201) {String} email Customer email
     * @apiSuccess (Created 201) {String} locale Customer locale
     * @apiSuccess (Created 201) {Number} timestamp Order creation timestamp
     * @apiSuccess (Created 201) {Reservation[]} reservations Reservations in this order
     * @apiSuccess (Created 201) {Number} reservations.id Reservation id
     * @apiSuccess (Created 201) {String} reservations.unique_id Reservation's unique id
     * @apiSuccess (Created 201) {Event} reservations.event Reservation event
     * @apiSuccess (Created 201) {Number} reservations.event.id Event id
     * @apiSuccess (Created 201) {String} reservations.event.location Location name
     * @apiSuccess (Created 201) {String} reservations.event.location_address Location address
     * @apiSuccess (Created 201) {String} reservations.event.location_directions_public_transport Directions for users of public transport
     * @apiSuccess (Created 201) {String} reservations.event.location_directions_car Directions for car drivers
     * @apiSuccess (Created 201) {String} reservations.event.dateandtime Textual description of the event date and time
     * @apiSuccess (Created 201) {Boolean} reservations.event.visible Visibility of the event
     * @apiSuccess (Created 201) {Seat} reservations.seat Reservation seat
     * @apiSuccess (Created 201) {Number} reservations.seat.id Seat id
     * @apiSuccess (Created 201) {Number} reservations.seat.block_id Seats block id
     * @apiSuccess (Created 201) {String} reservations.seat.name Seat name
     * @apiSuccess (Created 201) {Number} reservations.seat.x0 Coordinate
     * @apiSuccess (Created 201) {Number} reservations.seat.y0 Coordinate
     * @apiSuccess (Created 201) {Number} reservations.seat.x1 Coordinate
     * @apiSuccess (Created 201) {Number} reservations.seat.y1 Coordinate
     * @apiSuccess (Created 201) {Number} reservations.seat.x2 Coordinate
     * @apiSuccess (Created 201) {Number} reservations.seat.y2 Coordinate
     * @apiSuccess (Created 201) {Number} reservations.seat.x3 Coordinate
     * @apiSuccess (Created 201) {Number} reservations.seat.y3 Coordinate
     * @apiSuccess (Created 201) {Category} reservations.category Reservation category
     * @apiSuccess (Created 201) {Number} reservations.category.id Category id
     * @apiSuccess (Created 201) {String} reservations.category.name Category name
     * @apiSuccess (Created 201) {String} reservations.category.color Category color
     * @apiSuccess (Created 201) {String} reservations.category.price Category price
     * @apiSuccess (Created 201) {String} reservations.category.price_reduced Category price (reduced)
     * @apiSuccess (Created 201) {Boolean} reservations.isReduced Is this reservation reduced?
     * @apiSuccess (Created 201) {Number} reservations.price Reservation's price
     * @apiSuccess (Created 201) {Number} reservations.order_id Reservation order id (null if not ordered yet)
     *
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 Created
     * {
     *     "id": 221,
     *     "unique_id": "3e22b64c-29e1-11e8-b4f8-00259edaa0f6",
     *     "title": "m",
     *     "firstname": "John",
     *     "lastname": "Doe",
     *     "email": "john.doe@example.com",
     *     "locale": "en",
     *     "timestamp": 1128371626,
     *     "reservations": [
     *          {
     *              "id": 3869,
     *              "unique_id": "3e51b64c-29e1-11e8-b4f8-002590daa0f6",
     *              "event": {
     *                  "id": 1,
     *                  "name": "Example Event",
     *                  "location": "Example Hall",
     *                  "location_address": "42 Example Street",
     *                  "location_directions_public_transport": "Use the example line",
     *                  "location_directions_car": "Turn left, then right.",
     *                  "dateandtime": "First sunday in march at 9 am",
     *                  "visible": true,
     *              },
     *              "seat": {
     *                   "id": 77,
     *                   "block_id": 22,
     *                   "name": "Seat One",
     *                   "x0": null,
     *                   "y0": null,
     *                   "x1": null,
     *                   "y1": null,
     *                   "x2": null,
     *                   "y2": null,
     *                   "x3": null,
     *                   "y3": null
     *              },
     *              "category": {
     *                  "id": 3,
     *                  "name": "Block One",
     *                  "color": "#000",
     *                  "price": 30,
     *                  "price_reduced": 20
     *              },
     *              "isReduced": false,
     *              "price": 30,
     *              "order_id": null
     *         }
     *     ]
     * }
     *
     * @apiError (ReservationsExpired) 400 The reservations have expired and the order cannot be created.
     *
     * @apiErrorExample {json} Error-Response:
     * HTTP/1.1 409 Conflict
     */
    @Post()
    async create(@Body() body: { title: string, firstname: string, lastname: string, email: string, locale: string }) {
        try {
            return await this.basketService.createOrder(body);
        } catch (e) {
            throw new HttpException('Reservations have expired.', HttpStatus.BAD_REQUEST);
        }
    }
}