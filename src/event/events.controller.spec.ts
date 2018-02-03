import { Event } from './event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

describe('EventsController', () => {
    let eventsService: EventsService;
    let eventsController: EventsController;

    beforeEach(() => {
        eventsService = new EventsService(null);
        eventsController = new EventsController(eventsService);
    });

    it('Fetches all events from events service', async () => {
        let eventMock = new Event();
        eventMock.name = 'Test Event';
        spyOn(eventsService, 'findAll').and.returnValue([ eventMock ]);
        let events = eventsController.findAll();
        expect(await events).toEqual([ eventMock ]);
    });

    it('Fetches event with given id from events service', async () => {
        let eventMock = new Event();
        eventMock.id = 1;
        eventMock.name = 'Test Event';
        let eventsServiceFindSpy = spyOn(eventsService, 'find').and.returnValue(eventMock);
        let event = eventsController.find({ id: 1 });
        expect(await event).toEqual(eventMock);
    });
});