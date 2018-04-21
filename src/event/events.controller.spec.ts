import { Event, EventWithBlocks } from './event.entity';
import { EventsService } from './events.service';
import { EventsController, EventsAdminController } from './events.controller';

describe('EventsController', () => {
    let eventsService: EventsService;
    let eventsController: EventsController;

    beforeEach(() => {
        eventsService = new EventsService(null, null, null);
        eventsController = new EventsController(eventsService);
    });

    it('Fetches all events from events service', async () => {
        let eventMock = new Event();
        let eventsServiceFindAllSpy = spyOn(eventsService, 'findAllVisible').and.returnValue([ eventMock ]);
        let events = eventsController.findAll();
        expect(eventsServiceFindAllSpy).toHaveBeenCalledTimes(1);
        expect(await events).toEqual([ eventMock ]);
    });

    it('Fetches event with given id from events service', async () => {
        let eventWithBlocksMock = new EventWithBlocks(new Event, []);
        let eventsServiceFindSpy = spyOn(eventsService, 'find').and.returnValue(eventWithBlocksMock);
        let event = eventsController.find({ id: 1 });
        expect(eventsServiceFindSpy).toHaveBeenCalledWith(1);
        expect(await event).toEqual(eventWithBlocksMock);
    });
});

describe('EventsAdminController', () => {
    let eventsService: EventsService;
    let eventsAdminController: EventsAdminController;

    beforeEach(() => {
        eventsService = new EventsService(null, null, null);
        eventsAdminController = new EventsAdminController(eventsService);
    });

    it('Fetches all events from events service', async () => {
        let eventMock = new Event();
        let eventsServiceFindAllSpy = spyOn(eventsService, 'findAll').and.returnValue([ eventMock ]);
        let events = await eventsAdminController.findAll();
        expect(eventsServiceFindAllSpy).toHaveBeenCalledTimes(1);
        expect(events).toEqual([ eventMock ]);
    });

    it('Fetches event with given id from events service', async () => {
        let eventWithBlocksMock = new EventWithBlocks(new Event, []);
        let eventsServiceFindSpy = spyOn(eventsService, 'find').and.returnValue(eventWithBlocksMock);
        let event = await eventsAdminController.find({ id: 1 });
        expect(eventsServiceFindSpy).toHaveBeenCalledWith(1);
        expect(event).toEqual(eventWithBlocksMock);
    });

    it('Creates event using events service', async () => {
        let eventMock = new Event();
        let eventsServiceCreateSpy = spyOn(eventsService, 'create').and.returnValue(eventMock);
        let body = { name: 'name', address: 'address' };
        let event = await eventsAdminController.create(body);
        expect(eventsServiceCreateSpy).toHaveBeenCalledWith(body);
        expect(event).toEqual(eventMock);
    });

    it('Updates event using events service', async () => {
        let eventMock = new Event();
        let eventsServiceUpdateSpy = spyOn(eventsService, 'update').and.returnValue(eventMock);
        let body = { name: 'name', address: 'address' };
        let event = await eventsAdminController.update({ id: 1 }, body);
        expect(eventsServiceUpdateSpy).toHaveBeenCalledWith(1, body);
        expect(event).toEqual(eventMock);
    });

    it('Deletes an event using events service', () => {
        let eventsServiceDeleteSpy = spyOn(eventsService, 'delete');
        eventsAdminController.delete({ id: 1 });
        expect(eventsServiceDeleteSpy).toHaveBeenCalledTimes(1);
    });
});