import { Repository } from "typeorm";
import { Event } from "./event.entity";
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
        let events = eventsService.findAll();
        expect(eventRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(await events).toEqual([eventMock]);
    });

    it('Fetches visible events from repository', async () => {
        let eventMock = new Event();
        let eventRepositoryFindSpy = spyOn(eventRepository, 'find').and.returnValue([eventMock]);
        let events = eventsService.findAllVisible();
        expect(eventRepositoryFindSpy).toHaveBeenCalledWith({ visible: true });
        expect(await events).toEqual([eventMock]);
    });

    it('Fetches event with given id from repository', async () => {
        let eventMock = new Event();
        let eventRepositoryFindOneByIdSpy = spyOn(eventRepository, 'findOneById').and.returnValue(eventMock);
        let event = eventsService.find(1);
        expect(eventRepositoryFindOneByIdSpy).toHaveBeenCalledWith(1);
        expect(await event).toEqual(eventMock);
    });

    it('Deletes event with given id using repository', () => {
        let eventMock = new Event();
        let eventRepositoryDeleteSpy = spyOn(eventRepository, 'delete');
        let event = eventsService.delete(1);
        expect(eventRepositoryDeleteSpy).toHaveBeenCalledWith({ id: 1 });
    });
});