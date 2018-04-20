import { Repository } from "typeorm";
import { Event, EventDto } from "./event.entity";
import { EventsService } from "./events.service";

describe('EventsService', () => {
    let eventRepository: Repository<Event>;
    let eventsService: EventsService;

    beforeEach(() => {
        eventRepository = new Repository<Event>();
        eventsService = new EventsService(eventRepository);
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
        let eventRepositoryFindOneByIdSpy = spyOn(eventRepository, 'findOneById').and.returnValue(eventMock);
        let event = await eventsService.find(1);
        expect(eventRepositoryFindOneByIdSpy).toHaveBeenCalledWith(1);
        expect(event).toEqual(eventMock);
    });

    it('Creates event with given property values', async () => {
        let eventMock = new Event();
        let eventDtoMock = new EventDto();
        let eventDtoUpdateModelSpy = spyOn(eventDtoMock, 'updateModel');
        let eventRepositoryCreateSpy = spyOn(eventRepository, 'create').and.returnValue(eventMock);
        let eventRepositorySaveSpy = spyOn(eventRepository, 'save').and.returnValue(eventMock);
        let event = await eventsService.create(eventDtoMock);
        expect(eventRepositoryCreateSpy).toHaveBeenCalledTimes(1);
        expect(eventDtoUpdateModelSpy).toHaveBeenCalledWith(eventMock);
        expect(eventRepositorySaveSpy).toHaveBeenCalledWith(eventMock);
        expect(event).toEqual(eventMock);
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
        
        expect(eventMock.name).toEqual(eventDtoMock.name);
        expect(eventMock.location).toEqual(eventDtoMock.location);
        expect(eventMock.location_address).toEqual(eventDtoMock.location_address);
        expect(eventMock.location_directions_car).toEqual(eventDtoMock.location_directions_car);
        expect(eventMock.location_directions_public_transport).toEqual(eventDtoMock.location_directions_public_transport);
        expect(eventMock.dateandtime).toEqual(eventDtoMock.dateandtime);
        expect(eventMock.visible).toEqual(eventDtoMock.visible);
    });

    it('Updates event with false visibility', async () => {
        let eventMock = new Event();
        eventMock.visible = true;

        let eventDtoMock = new EventDto();
        eventDtoMock.visible = false;

        let eventRepositoryFindOneByIdSpy = spyOn(eventRepository, 'findOneById').and.returnValue(eventMock);
        let eventRepositorySaveSpy = spyOn(eventRepository, 'save').and.returnValue(eventMock);
        let event = await eventsService.update(1, eventDtoMock);
        
        expect(eventMock.visible).toEqual(eventDtoMock.visible);
    });

    it('Updates event with no visibility', async () => {
        let eventMock = new Event();
        eventMock.visible = true;

        let eventDtoMock = new EventDto();

        let eventRepositoryFindOneByIdSpy = spyOn(eventRepository, 'findOneById').and.returnValue(eventMock);
        let eventRepositorySaveSpy = spyOn(eventRepository, 'save').and.returnValue(eventMock);
        let event = await eventsService.update(1, eventDtoMock);
        
        expect(eventMock.visible).toEqual(eventMock.visible);
    });

    it('Deletes event with given id using repository', async () => {
        let eventMock = new Event();
        let eventRepositoryDeleteSpy = spyOn(eventRepository, 'delete');
        await eventsService.delete(1);
        expect(eventRepositoryDeleteSpy).toHaveBeenCalledWith({ id: 1 });
    });
});