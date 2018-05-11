import { EventblocksService } from './eventblocks.service';
import { EventblocksController, EventblocksAdminController } from './eventblocks.controller';
import { Event } from '../event/event.entity';
import { MergedEventblock, MergedEventblockPart, Eventblock } from './eventblock.entity';
import { Category } from '../category/category.entity';
import { Seat, AugmentedSeat, SeatState } from '../seat/seat.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('EventblockController', () => {
    let eventblocksService: EventblocksService;
    let eventblocksController: EventblocksController;

    beforeEach(() => {
        eventblocksService = new EventblocksService(null, null, null, null, null, null);
        eventblocksController = new EventblocksController(eventblocksService);
    });

    it('Fetches merged eventblock with given key from eventblocks service', async () => {
        const eventMock = new Event();
        const categoryMock = new Category();
        const seatMock = new Seat();
        const augmentedSeatMock = new AugmentedSeat(seatMock, SeatState.Free);
        const partMock = new MergedEventblockPart(1, categoryMock, [ augmentedSeatMock ]);
        const mergedEventblockMock = new MergedEventblock('1-2', 'one-two', true, eventMock, 'url', [ partMock ]);
        const blockServiceFindSpy = spyOn(eventblocksService, 'getMergedEventblock').and.returnValue(mergedEventblockMock);
        const mergedEventblock = await eventblocksController.find({ key: '1-2' }, { token: 'token' });
        expect(blockServiceFindSpy).toHaveBeenCalledWith('1-2', 'token');
        expect(mergedEventblock).toEqual(mergedEventblockMock);
    });

    it('Throws HttpException when eventblock with given key is not available', async () => {
        const blockServiceFindSpy = spyOn(eventblocksService, 'getMergedEventblock').and.returnValue(undefined);
        let rejected: boolean;
        await eventblocksController.find({ key: '1-2' }, { token: 'token' }).catch(_ => rejected = true);
        expect(rejected).toEqual(true, 'Promise has to be rejected when no eventblock can be found.');
        expect(blockServiceFindSpy).toHaveBeenCalledWith('1-2', 'token');
    });
});

describe('EventblockController', () => {
    let eventblocksService: EventblocksService;
    let eventblocksAdminController: EventblocksAdminController;

    beforeEach(() => {
        eventblocksService = new EventblocksService(null, null, null, null, null, null);
        eventblocksAdminController = new EventblocksAdminController(eventblocksService);
    });

    it('Creates eventblock using eventblocks service', async () => {
        const eventblockMock = new Eventblock();
        const eventblocksServiceCreateSpy = spyOn(eventblocksService, 'create').and.returnValue(eventblockMock);
        const body = { event_id: 1, block_id: 2, category_id: 3 };
        const event = await eventblocksAdminController.create(body);
        expect(eventblocksServiceCreateSpy).toHaveBeenCalledWith(body);
        expect(event).toEqual(eventblockMock);
    });

    it('Deletes an eventblock using eventblocks service', () => {
        const eventblocksServiceDeleteSpy = spyOn(eventblocksService, 'delete');
        eventblocksAdminController.delete({ id: 1 });
        expect(eventblocksServiceDeleteSpy).toHaveBeenCalledTimes(1);
    });
});