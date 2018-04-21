import { Repository } from "typeorm";
import { EventsService } from "./events.service";
import { BlocksService } from "../block/blocks.service";
import { EventblocksService } from "../eventblock/eventblocks.service";
import { Event, EventDto, EventWithBlocks } from "./event.entity";
import { Block } from "../block/block.entity";
import { Category } from "../category/category.entity";
import { Seat } from "../seat/seat.entity";
import { Eventblock } from "../eventblock/eventblock.entity";

describe('EventsService', () => {
    let eventRepository: Repository<Event>;
    let blocksService: BlocksService;
    let eventblocksService: EventblocksService;
    let eventsService: EventsService;

    beforeEach(() => {
        eventRepository = new Repository<Event>();
        blocksService = new BlocksService(new Repository<Block>());
        eventblocksService = new EventblocksService(new Repository<Event>(), new Repository<Category>(), new Repository<Block>(), new Repository<Eventblock>(), new Repository<Seat>());
        eventsService = new EventsService(eventRepository, blocksService, eventblocksService);
    });

    it('Fetches all events from repository', async () => {
        let eventMock = new Event();
        let eventRepositoryFindSpy = spyOn(eventRepository, 'find').and.returnValue([eventMock]);
        let events = await eventsService.findAll();
        expect(eventRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(events).toEqual([eventMock]);
    });

    it('Fetches visible events from repository', async () => {
        let eventMock = new Event();
        let eventRepositoryFindSpy = spyOn(eventRepository, 'find').and.returnValue([eventMock]);
        let events = await eventsService.findAllVisible();
        expect(eventRepositoryFindSpy).toHaveBeenCalledWith({ visible: true });
        expect(events).toEqual([eventMock]);
    });

    it('Fetches event with given id from repository', async () => {
        let eventMock = new Event();
        eventMock.id = 42;
        let eventWithBlocksMock = new EventWithBlocks(eventMock, []);
        let eventRepositoryFindOneByIdSpy = spyOn(eventRepository, 'findOneById').and.returnValue(eventMock);
        let blocksServiceGetMergedEventblocksSpy = spyOn(eventblocksService, 'getThinMergedEventblocks').and.returnValue([]);
        let eventWithBlocks = await eventsService.find(1);
        expect(eventRepositoryFindOneByIdSpy).toHaveBeenCalledWith(1);
        expect(blocksServiceGetMergedEventblocksSpy).toHaveBeenCalledWith(42);
        expect(eventWithBlocks).toEqual(eventWithBlocksMock);
    });

    it('Creates event with given property values', async () => {
        let eventMock = new Event();
        let eventDtoMock = new EventDto();
        eventDtoMock.name = 'dto.name';
        eventDtoMock.location = 'dto.loc';
        eventDtoMock.location_address = 'dto.loc.addr.';
        eventDtoMock.location_directions_car = 'dto.loc.dir.car';
        eventDtoMock.location_directions_public_transport = 'dto.loc.dir.pub.trsp.';
        eventDtoMock.dateandtime = 'model.dat';
        eventDtoMock.visible = true;

        let eventRepositoryCreateSpy = spyOn(eventRepository, 'create').and.returnValue(eventMock);
        let eventRepositorySaveSpy = spyOn(eventRepository, 'save').and.returnValue(eventMock);
        let event = await eventsService.create(eventDtoMock);
        
        expect(eventRepositoryCreateSpy).toHaveBeenCalledTimes(1);
        expect(eventRepositorySaveSpy).toHaveBeenCalledWith(eventMock);
        
        expect(event).toEqual(eventMock);
        expect(event.name).toEqual(eventDtoMock.name);
        expect(event.location).toEqual(eventDtoMock.location);
        expect(event.location_address).toEqual(eventDtoMock.location_address);
        expect(event.location_directions_car).toEqual(eventDtoMock.location_directions_car);
        expect(event.location_directions_public_transport).toEqual(eventDtoMock.location_directions_public_transport);
        expect(event.dateandtime).toEqual(eventDtoMock.dateandtime);
        expect(event.visible).toEqual(eventDtoMock.visible);
    });

    it('Updates event with given property values', async () => {
        let eventMock = new Event();
        eventMock.name = 'model.name';
        eventMock.location = 'model.loc';
        eventMock.location_address = 'model.loc.addr';
        eventMock.location_directions_car = 'model.loc.dir.car';
        eventMock.location_directions_public_transport = 'model.loc.dir.pub.trsp';
        eventMock.dateandtime = 'model.dat';
        eventMock.visible = false;

        let eventDtoMock = new EventDto();
        eventDtoMock.name = 'dto.name';
        eventDtoMock.location = 'dto.loc';
        eventDtoMock.location_address = 'dto.loc.addr.';
        eventDtoMock.location_directions_car = 'dto.loc.dir.car';
        eventDtoMock.location_directions_public_transport = 'dto.loc.dir.pub.trsp.';
        eventDtoMock.dateandtime = 'model.dat';
        eventDtoMock.visible = true;

        let eventRepositoryFindOneByIdSpy = spyOn(eventRepository, 'findOneById').and.returnValue(eventMock);
        let eventRepositorySaveSpy = spyOn(eventRepository, 'save').and.returnValue(eventMock);
        let event = await eventsService.update(1, eventDtoMock);

        expect(eventRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(eventRepositorySaveSpy).toHaveBeenCalledWith(eventMock);
        
        expect(event).toEqual(eventMock);
        expect(event.name).toEqual(eventDtoMock.name);
        expect(event.location).toEqual(eventDtoMock.location);
        expect(event.location_address).toEqual(eventDtoMock.location_address);
        expect(event.location_directions_car).toEqual(eventDtoMock.location_directions_car);
        expect(event.location_directions_public_transport).toEqual(eventDtoMock.location_directions_public_transport);
        expect(event.dateandtime).toEqual(eventDtoMock.dateandtime);
        expect(event.visible).toEqual(eventDtoMock.visible);
    });

    it('Updates event with false visibility', async () => {
        let eventMock = new Event();
        eventMock.visible = true;

        let eventDtoMock = new EventDto();
        eventDtoMock.visible = false;

        let eventRepositoryFindOneByIdSpy = spyOn(eventRepository, 'findOneById').and.returnValue(eventMock);
        let eventRepositorySaveSpy = spyOn(eventRepository, 'save').and.returnValue(eventMock);
        let event = await eventsService.update(1, eventDtoMock);
        
        expect(event.visible).toEqual(eventDtoMock.visible);
    });

    it('Updates event with no visibility', async () => {
        let eventMock = new Event();
        eventMock.visible = true;

        let eventDtoMock = new EventDto();

        let eventRepositoryFindOneByIdSpy = spyOn(eventRepository, 'findOneById').and.returnValue(eventMock);
        let eventRepositorySaveSpy = spyOn(eventRepository, 'save').and.returnValue(eventMock);
        let event = await eventsService.update(1, eventDtoMock);
        
        expect(event.visible).toEqual(eventMock.visible);
    });

    it('Deletes event with given id using repository', async () => {
        let eventRepositoryDeleteSpy = spyOn(eventRepository, 'delete');
        await eventsService.delete(1);
        expect(eventRepositoryDeleteSpy).toHaveBeenCalledWith({ id: 1 });
    });
});