import { Repository } from 'typeorm';
import { EventsService } from './events.service';
import { BlocksService } from '../block/blocks.service';
import { EventblocksService } from '../eventblock/eventblocks.service';
import { Event, EventDto, EventWithBlocks } from './event.entity';
import { Block } from '../block/block.entity';
import { Category } from '../category/category.entity';
import { Seat } from '../seat/seat.entity';
import { Eventblock } from '../eventblock/eventblock.entity';
import { Reservation } from '../reservation/reservation.entity';
import { SeatsService } from '../seat/seats.service';

describe('EventsService', () => {
    let eventRepository: Repository<Event>;
    let eventblocksService: EventblocksService;
    let seatsService: SeatsService;
    let eventsService: EventsService;

    beforeEach(() => {
        eventRepository = new Repository<Event>();
        seatsService = new SeatsService(new Repository<Seat>(), new Repository<Reservation>());
        eventblocksService = new EventblocksService(new Repository<Event>(), new Repository<Category>(), new Repository<Block>(), new Repository<Eventblock>(), new Repository<Seat>(), seatsService);
        eventsService = new EventsService(eventRepository, eventblocksService);
    });

    it('Fetches all events from repository', async () => {
        const eventMock = new Event();
        const eventRepositoryFindSpy = spyOn(eventRepository, 'find').and.returnValue([eventMock]);
        const events = await eventsService.findAll();
        expect(eventRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(events).toEqual([eventMock]);
    });

    it('Fetches visible events from repository', async () => {
        const eventMock = new Event();
        const eventRepositoryFindSpy = spyOn(eventRepository, 'find').and.returnValue([eventMock]);
        const events = await eventsService.findAllVisible();
        expect(eventRepositoryFindSpy).toHaveBeenCalledWith({ visible: true });
        expect(events).toEqual([eventMock]);
    });

    it('Fetches event with given id from repository', async () => {
        const eventMock = new Event();
        eventMock.id = 42;
        const eventWithBlocksMock = new EventWithBlocks(eventMock, []);
        const eventRepositoryfindOneSpy = spyOn(eventRepository, 'findOne').and.returnValue(eventMock);
        const blocksServiceGetMergedEventblocksSpy = spyOn(eventblocksService, 'getThinMergedEventblocks').and.returnValue([]);
        const eventWithBlocks = await eventsService.find(1);
        expect(eventRepositoryfindOneSpy).toHaveBeenCalledWith({ id: 1 });
        expect(blocksServiceGetMergedEventblocksSpy).toHaveBeenCalledWith(42);
        expect(eventWithBlocks).toEqual(eventWithBlocksMock);
    });

    it('Creates event with given property values', async () => {
        const eventMock = new Event();
        const eventDtoMock = {
            name: 'dto.name',
            location: 'dto.loc',
            location_address: 'dto.loc.addr.',
            location_directions_car: 'dto.loc.dir.car',
            location_directions_public_transport: 'dto.loc.dir.pub.trsp.',
            dateandtime: 'model.dat',
            visible: true
        };

        const eventRepositoryCreateSpy = spyOn(eventRepository, 'create').and.returnValue(eventMock);
        const eventRepositorySaveSpy = spyOn(eventRepository, 'save').and.returnValue(eventMock);
        const event = await eventsService.create(eventDtoMock);

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
        const eventMock = new Event();
        eventMock.name = 'model.name';
        eventMock.location = 'model.loc';
        eventMock.location_address = 'model.loc.addr';
        eventMock.location_directions_car = 'model.loc.dir.car';
        eventMock.location_directions_public_transport = 'model.loc.dir.pub.trsp';
        eventMock.dateandtime = 'model.dat';
        eventMock.visible = false;

        const eventDtoMock = {
            name: 'dto.name',
            location: 'dto.loc',
            location_address: 'dto.loc.addr.',
            location_directions_car: 'dto.loc.dir.car',
            location_directions_public_transport: 'dto.loc.dir.pub.trsp.',
            dateandtime: 'model.dat',
            visible: true
        };

        const eventRepositoryfindOneSpy = spyOn(eventRepository, 'findOne').and.returnValue(eventMock);
        const eventRepositorySaveSpy = spyOn(eventRepository, 'save').and.returnValue(eventMock);
        const event = await eventsService.update(1, eventDtoMock);

        expect(eventRepositoryfindOneSpy).toHaveBeenCalledTimes(1);
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
        const eventMock = new Event();
        eventMock.visible = true;

        const eventDtoMock = {
            visible: false
        };

        const eventRepositoryfindOneSpy = spyOn(eventRepository, 'findOne').and.returnValue(eventMock);
        const eventRepositorySaveSpy = spyOn(eventRepository, 'save').and.returnValue(eventMock);
        const event = await eventsService.update(1, eventDtoMock);

        expect(event.visible).toEqual(eventDtoMock.visible);
    });

    it('Updates event with no visibility', async () => {
        const eventMock = new Event();
        eventMock.visible = true;

        const eventDtoMock = { };

        const eventRepositoryfindOneSpy = spyOn(eventRepository, 'findOne').and.returnValue(eventMock);
        const eventRepositorySaveSpy = spyOn(eventRepository, 'save').and.returnValue(eventMock);
        const event = await eventsService.update(1, eventDtoMock);

        expect(event.visible).toEqual(eventMock.visible);
    });

    it('Deletes event with given id using repository', async () => {
        const eventRepositoryDeleteSpy = spyOn(eventRepository, 'delete');
        await eventsService.delete(1);
        expect(eventRepositoryDeleteSpy).toHaveBeenCalledWith({ id: 1 });
    });
});
