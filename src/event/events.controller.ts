import { Controller, Get, Param, Delete } from "@nestjs/common";
import { EventsService } from "./events.service";
import { Event } from "./event.entity";

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) { }
    
    @Get()
    public findAll(): Promise<Event[]> {
        return this.eventsService.findAllVisible();
    }

    @Get(':id')
    public find(@Param() params): Promise<Event> {
        return this.eventsService.find(params.id);
    }
}

@Controller('admin/events')
export class EventsAdminController {
    constructor(private readonly eventsService: EventsService) { }

    @Get()
    public findAll(): Promise<Event[]> {
        return this.eventsService.findAll();
    }

    @Get(':id')
    public find(@Param() params): Promise<Event> {
        return this.eventsService.find(params.id);
    }

    @Delete(':id')
    public delete(@Param() params): Promise<void> {
        return this.eventsService.delete(params.id);
    }
}