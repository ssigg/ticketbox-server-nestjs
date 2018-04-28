import { EventblocksService } from "./eventblocks.service";
import { EventblocksController } from "./eventblocks.controller";
import { Event } from "../event/event.entity";
import { MergedEventblock, MergedEventblockPart } from "./eventblock.entity";
import { Category } from "../category/category.entity";
import { Seat, AugmentedSeat, SeatState } from "../seat/seat.entity";
import { HttpException, HttpStatus } from "@nestjs/common";

describe('EventblockController', () => {
    let eventblocksService: EventblocksService;
    let eventblocksController: EventblocksController;

    beforeEach(() => {
        eventblocksService = new EventblocksService(null, null, null, null, null, null);
        eventblocksController = new EventblocksController(eventblocksService);
    });

    it('Fetches merged eventblock with given key from eventblocks service', async () => {
        let eventMock = new Event();
        let categoryMock = new Category();
        let seatMock = new Seat();
        let augmentedSeatMock = new AugmentedSeat(seatMock, SeatState.Free)
        let partMock = new MergedEventblockPart(1, categoryMock, [ augmentedSeatMock ])
        let mergedEventblockMock = new MergedEventblock('1-2', 'one-two', true, eventMock, 'url', [ partMock ]);
        let blockServiceFindSpy = spyOn(eventblocksService, 'getMergedEventblock').and.returnValue(mergedEventblockMock);
        let mergedEventblock = await eventblocksController.find({ key: '1-2' }, { token: 'token' });
        expect(blockServiceFindSpy).toHaveBeenCalledWith('1-2', 'token');
        expect(mergedEventblock).toEqual(mergedEventblockMock);
    });

    it('Throws HttpException when eventblock with given key is not available', async () => {
        let blockServiceFindSpy = spyOn(eventblocksService, 'getMergedEventblock').and.returnValue(undefined);
        let rejected: boolean;
        await eventblocksController.find({ key: '1-2' }, { token: 'token' }).catch(_ => rejected = true);
        expect(rejected).toEqual(true, 'Promise has to be rejected when no eventblock can be found.');
        expect(blockServiceFindSpy).toHaveBeenCalledWith('1-2', 'token');
    });
});