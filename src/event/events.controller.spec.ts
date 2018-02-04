import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsController, EventsAdminController } from './events.controller';

describe('EventsController', () => {
    let eventsService: EventsService;
    let eventsController: EventsController;

    beforeEach(() => {
        eventsService = new EventsService(null);
        eventsController = new EventsController(eventsService);
    });

    it('Fetches all events from events service', async () => {
        let eventMock = new Event();
        let eventsServiceFindAllSpy = spyOn(eventsService, 'findAll').and.returnValue([ eventMock ]);
        let events = eventsController.findAll();
        expect(eventsServiceFindAllSpy).toHaveBeenCalledTimes(1);
        expect(await events).toEqual([ eventMock ]);
    });

    it('Fetches event with given id from events service', async () => {
        let eventMock = new Event();
        let eventsServiceFindSpy = spyOn(eventsService, 'find').and.returnValue(eventMock);
        let event = eventsController.find({ id: 1 });
        expect(eventsServiceFindSpy).toHaveBeenCalledWith(1);
        expect(await event).toEqual(eventMock);
    });
});

describe('EventsAdminController', () => {
    let eventsService: EventsService;
    let eventsAdminController: EventsAdminController;

    beforeEach(() => {
        eventsService = new EventsService(null);
        eventsAdminController = new EventsAdminController(eventsService);
    });

    it('Fetches all events from events service', async () => {
        let eventMock = new Event();
        let eventsServiceFindAllSpy = spyOn(eventsService, 'findAll').and.returnValue([ eventMock ]);
        let events = eventsAdminController.findAll();
        expect(eventsServiceFindAllSpy).toHaveBeenCalledTimes(1);
        expect(await events).toEqual([ eventMock ]);
    });

    it('Fetches event with given id from events service', async () => {
        let eventMock = new Event();
        let eventsServiceFindSpy = spyOn(eventsService, 'find').and.returnValue(eventMock);
        let event = eventsAdminController.find({ id: 1 });
        expect(eventsServiceFindSpy).toHaveBeenCalledWith(1);
        expect(await event).toEqual(eventMock);
    });

    it('Deletes an event using events service', () => {
        let eventsServiceDeleteSpy = spyOn(eventsService, 'delete');
        eventsAdminController.delete({ id: 1 });
        expect(eventsServiceDeleteSpy).toHaveBeenCalledTimes(1);
    });
});