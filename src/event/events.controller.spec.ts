import { Event, EventWithBlocks } from './event.entity';
import { EventsService } from './events.service';
import { EventsController, EventsAdminController } from './events.controller';

describe('EventsController', () => {
    let eventsService: EventsService;
    let eventsController: EventsController;

    beforeEach(() => {
        eventsService = new EventsService(null, null);
        eventsController = new EventsController(eventsService);
    });

    it('Fetches all events from events service', async () => {
        const eventMock = new Event();
        const eventsServiceFindAllSpy = spyOn(eventsService, 'findAllVisible').and.returnValue([ eventMock ]);
        const events = eventsController.findAll();
        expect(eventsServiceFindAllSpy).toHaveBeenCalledTimes(1);
        expect(await events).toEqual([ eventMock ]);
    });

    it('Fetches event with given id from events service', async () => {
        const eventWithBlocksMock = new EventWithBlocks(new Event(), []);
        const eventsServiceFindSpy = spyOn(eventsService, 'find').and.returnValue(eventWithBlocksMock);
        const event = eventsController.find({ id: 1 });
        expect(eventsServiceFindSpy).toHaveBeenCalledWith(1);
        expect(await event).toEqual(eventWithBlocksMock);
    });
});

describe('EventsAdminController', () => {
    let eventsService: EventsService;
    let eventsAdminController: EventsAdminController;

    beforeEach(() => {
        eventsService = new EventsService(null, null);
        eventsAdminController = new EventsAdminController(eventsService);
    });

    it('Fetches all events from events service', async () => {
        const eventMock = new Event();
        const eventsServiceFindAllSpy = spyOn(eventsService, 'findAll').and.returnValue([ eventMock ]);
        const events = await eventsAdminController.findAll();
        expect(eventsServiceFindAllSpy).toHaveBeenCalledTimes(1);
        expect(events).toEqual([ eventMock ]);
    });

    it('Fetches event with given id from events service', async () => {
        const eventWithBlocksMock = new EventWithBlocks(new Event(), []);
        const eventsServiceFindSpy = spyOn(eventsService, 'find').and.returnValue(eventWithBlocksMock);
        const event = await eventsAdminController.find({ id: 1 });
        expect(eventsServiceFindSpy).toHaveBeenCalledWith(1);
        expect(event).toEqual(eventWithBlocksMock);
    });

    it('Creates event using events service', async () => {
        const eventMock = new Event();
        const eventsServiceCreateSpy = spyOn(eventsService, 'create').and.returnValue(eventMock);
        const body = { name: 'name', address: 'address' };
        const event = await eventsAdminController.create(body);
        expect(eventsServiceCreateSpy).toHaveBeenCalledWith(body);
        expect(event).toEqual(eventMock);
    });

    it('Updates event using events service', async () => {
        const eventMock = new Event();
        const eventsServiceUpdateSpy = spyOn(eventsService, 'update').and.returnValue(eventMock);
        const body = { name: 'name', address: 'address' };
        const event = await eventsAdminController.update({ id: 1 }, body);
        expect(eventsServiceUpdateSpy).toHaveBeenCalledWith(1, body);
        expect(event).toEqual(eventMock);
    });

    it('Deletes an event using events service', () => {
        const eventsServiceDeleteSpy = spyOn(eventsService, 'delete');
        eventsAdminController.delete({ id: 1 });
        expect(eventsServiceDeleteSpy).toHaveBeenCalledTimes(1);
    });
});