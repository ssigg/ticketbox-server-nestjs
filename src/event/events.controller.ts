import { Controller, Param, Body, Get, Delete, Put, Post } from "@nestjs/common";
import { EventsService } from "./events.service";
import { Event, EventWithBlocks } from "./event.entity";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }
    
    /**
     * @api {get} /events Get all visible events
     * @apiName GetVisibleEvents
     * @apiGroup Event
     * @apiPermission none
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {Number} id Event id
     * @apiSuccess {String} name Event name
     * @apiSuccess {String} location Location name
     * @apiSuccess {String} location_address Location address
     * @apiSuccess {String} location_directions_public_transport Directions for users of public transport
     * @apiSuccess {String} location_directions_car Directions for car drivers
     * @apiSuccess {String} dateandtime Textual description of the event date and time
     * @apiSuccess {Boolean} visible Visibility of the event
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "id": 1,
     *         "name": "Example Event",
     *         "location": "Example Hall",
     *         "location_address": "42 Example Street",
     *         "location_directions_public_transport": "Use the example line",
     *         "location_directions_car": "Turn left, then right.",
     *         "dateandtime": "First sunday in march at 9 am",
     *         "visible": true
     *     }
     * ]
     */
    @Get()
    public findAll(): Promise<Event[]> {
        return this.eventsService.findAllVisible();
    }

    /**
     * @api {get} /events/:id Get one event
     * @apiName GetEvent
     * @apiGroup Event
     * @apiPermission none
     * @apiVersion 1.0.0
     * 
     * @apiParam {Number} id Event id
     * 
     * @apiSuccess {Number} id Event id
     * @apiSuccess {String} name Event name
     * @apiSuccess {String} location Location name
     * @apiSuccess {String} location_address Location address
     * @apiSuccess {String} location_directions_public_transport Directions for users of public transport
     * @apiSuccess {String} location_directions_car Directions for car drivers
     * @apiSuccess {String} dateandtime Textual description of the event date and time
     * @apiSuccess {Boolean} visible Visibility of the event
     * @apiSuccess {Block[]} blocks List of seating blocks
     * @apiSuccess {String} blocks.id Block key
     * @apiSuccess {String} blocks.name Block name
     * @apiSuccess {Boolean} blocks.numbered Is this a numbered block?
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "id": 1,
     *     "name": "Example Event",
     *     "location": "Example Hall",
     *     "location_address": "42 Example Street",
     *     "location_directions_public_transport": "Use the example line",
     *     "location_directions_car": "Turn left, then right.",
     *     "dateandtime": "First sunday in march at 9 am",
     *     "visible": true,
     *     "blocks": [
     *          {
     *              "id": "10",
     *              "name": "Example Block"
     *              "numbered": false
     *          }
     *     ]
     * }
     */
    @Get(':id')
    public find(@Param() params): Promise<EventWithBlocks> {
        return this.eventsService.find(params.id);
    }
}

@Controller('admin/events')
export class EventsAdminController {
    constructor(private readonly eventsService: EventsService) { }

    /**
     * @api {get} /admin/events Get all events
     * @apiName GetAllEvents
     * @apiGroup Event
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiSuccess {Number} id Event id
     * @apiSuccess {String} name Event name
     * @apiSuccess {String} location Location name
     * @apiSuccess {String} location_address Location address
     * @apiSuccess {String} location_directions_public_transport Directions for users of public transport
     * @apiSuccess {String} location_directions_car Directions for car drivers
     * @apiSuccess {String} dateandtime Textual description of the event date and time
     * @apiSuccess {Boolean} visible Visibility of the event
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * [
     *     {
     *         "id": 1,
     *         "name": "Example Event",
     *         "location": "Example Hall",
     *         "location_address": "42 Example Street",
     *         "location_directions_public_transport": "Use the example line",
     *         "location_directions_car": "Turn left, then right.",
     *         "dateandtime": "First sunday in march at 9 am",
     *         "visible": false
     *     }
     * ]
     */
    @Get()
    public findAll(): Promise<Event[]> {
        return this.eventsService.findAll();
    }

    /**
     * @api {get} /admin/events/:id Get one raw event
     * @apiName GetRawEvent
     * @apiGroup Event
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiParam {Number} id Event id
     * 
     * @apiSuccess {Number} id Event id
     * @apiSuccess {String} name Event name
     * @apiSuccess {String} location Location name
     * @apiSuccess {String} location_address Location address
     * @apiSuccess {String} location_directions_public_transport Directions for users of public transport
     * @apiSuccess {String} location_directions_car Directions for car drivers
     * @apiSuccess {String} dateandtime Textual description of the event date and time
     * @apiSuccess {Boolean} visible Visibility of the event
     * @apiSuccess {Block[]} blocks List of seating blocks
     * @apiSuccess {String} blocks.id Block key
     * @apiSuccess {String} blocks.name Block name
     * @apiSuccess {Boolean} blocks.numbered Is this a numbered block?
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "id": 22,
     *     "name": "Example Event",
     *     "location": "Example Hall",
     *     "location_address": "42 Example Street",
     *     "location_directions_public_transport": "Use the example line",
     *     "location_directions_car": "Turn left, then right.",
     *     "dateandtime": "First sunday in march at 9 am",
     *     "visible": false,
     *     "blocks": [
     *          {
     *              "id": "10",
     *              "name": "Example Block"
     *              "numbered": false
     *          }
     *     ]
     * }
     */
    @Get(':id')
    public find(@Param() params): Promise<EventWithBlocks> {
        return this.eventsService.find(params.id);
    }

    /**
     * @api {post} /admin/events Create event
     * @apiName CreateEvent
     * @apiGroup Event
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiParam {String} name Event name
     * @apiParam {String} [location] Location name
     * @apiParam {String} [location_address] Location address
     * @apiParam {String} [location_directions_public_transport] Directions for users of public transport
     * @apiParam {String} [location_directions_car] Directions for car drivers
     * @apiParam {String} [dateandtime] Textual description of the event date and time
     * @apiParam {Boolean} [visible] Visibility of the event
     * 
     * @apiParamExample {json} Request-Example:
     * {
     *   "name": "Example Event"
     * }
     * 
     * @apiSuccess (Created 201) {Number} id Event id
     * @apiSuccess (Created 201) {String} name Name
     * @apiSuccess (Created 201) {String} location Location name
     * @apiSuccess (Created 201) {String} location_address Location address
     * @apiSuccess (Created 201) {String} location_directions_public_transport Directions for users of public transport
     * @apiSuccess (Created 201) {String} location_directions_car Directions for car drivers
     * @apiSuccess (Created 201) {String} dateandtime Textual description of the event date and time
     * @apiSuccess (Created 201) {Boolean} visible Visibility of the event
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 201 Created
     * {
     *     "id": 1,
     *     "name": "Example Event",
     *     "location": "Example Hall",
     *     "location_address": "42 Example Street",
     *     "location_directions_public_transport": "Use the example line",
     *     "location_directions_car": "Turn left, then right.",
     *     "dateandtime": "First sunday in march at 9 am",
     *     "visible": true,
     * }
     */
    @Post()
    public create(@Body() body): Promise<Event> {
        return this.eventsService.create(body);
    }

    /**
     * @api {put} /admin/events/:id Update event
     * @apiName UpdateEvent
     * @apiGroup Event
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiParam {Number} id Event id
     * @apiParam {String} name Event name
     * @apiParam {String} [location] Location name
     * @apiParam {String} [location_address] Location address
     * @apiParam {String} [location_directions_public_transport] Directions for users of public transport
     * @apiParam {String} [location_directions_car] Directions for car drivers
     * @apiParam {String} [dateandtime] Textual description of the event date and time
     * @apiParam {Boolean} [visible] Visibility of the event
     * 
     * @apiParamExample {json} Request-Example:
     * {
     *   "name": "Example Event"
     * }
     * 
     * @apiSuccess {Number} id Event id
     * @apiSuccess {String} name Name
     * @apiSuccess {String} location Location name
     * @apiSuccess {String} location_address Location address
     * @apiSuccess {String} location_directions_public_transport Directions for users of public transport
     * @apiSuccess {String} location_directions_car Directions for car drivers
     * @apiSuccess {String} dateandtime Textual description of the event date and time
     * @apiSuccess {Boolean} visible Visibility of the event
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     * {
     *     "id": 1,
     *     "name": "Example Event",
     *     "location": "Example Hall",
     *     "location_address": "42 Example Street",
     *     "location_directions_public_transport": "Use the example line",
     *     "location_directions_car": "Turn left, then right.",
     *     "dateandtime": "First sunday in march at 9 am",
     *     "visible": true,
     * }
     */
    @Put(':id')
    public update(@Param() params, @Body() body): Promise<Event> {
        return this.eventsService.update(params.id, body);
    }

    /**
     * @api {delete} /admin/events/:id Delete event
     * @apiName DeleteEvent
     * @apiGroup Event
     * @apiPermission admin
     * @apiVersion 1.0.0
     * 
     * @apiParam {Number} id Event id
     * 
     * @apiSuccessExample {json} Success-Response:
     * HTTP/1.1 200 OK
     */
    @Delete(':id')
    public delete(@Param() params): Promise<DeleteResult> {
        return this.eventsService.delete(params.id);
    }
}