import { Repository } from "typeorm";
import { Event } from "../event/event.entity";
import { Category } from "../category/category.entity";
import { Seat, AugmentedSeat, SeatState } from "../seat/seat.entity";
import { Block, BlockDto } from "../block/block.entity";
import { Eventblock, EventblockDto, MergedEventblockPart } from "./eventblock.entity";
import { EventblocksService } from "./eventblocks.service";
import { Reservation } from "../reservation/reservation.entity";
import { SeatsService } from "../seat/seats.service";

describe('EventblocksService', () => {
    let eventRepository: Repository<Event>;
    let categoryRepository: Repository<Category>;
    let blockRepository: Repository<Block>;
    let eventblockRepository: Repository<Eventblock>;
    let seatRepository: Repository<Seat>;
    let reservationRepository: Repository<Reservation>;
    let seatsService: SeatsService;
    let eventblocksService: EventblocksService;

    beforeEach(() => {
        eventRepository = new Repository<Event>();
        categoryRepository = new Repository<Category>();
        blockRepository = new Repository<Block>();
        eventblockRepository = new Repository<Eventblock>();
        seatRepository = new Repository<Seat>();
        reservationRepository = new Repository<Reservation>();
        seatsService = new SeatsService(seatRepository, reservationRepository);
        eventblocksService = new EventblocksService(eventRepository, categoryRepository, blockRepository, eventblockRepository, seatRepository, seatsService);
    });

    it('Creates eventblock with given property values', async () => {
        let eventblockMock = new Eventblock();
        let eventblockDtoMock = {
            block_id: 1,
            category_id: 2,
            event_id: 3
        };

        let eventblockRepositoryCreateSpy = spyOn(eventblockRepository, 'create').and.returnValue(eventblockMock);
        let eventblockRepositorySaveSpy = spyOn(eventblockRepository, 'save').and.returnValue(eventblockMock);
        let eventblock = await eventblocksService.create(eventblockDtoMock);
        
        expect(eventblockRepositoryCreateSpy).toHaveBeenCalledTimes(1);
        expect(eventblockRepositorySaveSpy).toHaveBeenCalledWith(eventblockMock);
        
        expect(eventblock).toEqual(eventblockMock);
        expect(eventblock.block_id).toEqual(eventblockDtoMock.block_id);
        expect(eventblock.category_id).toEqual(eventblockDtoMock.category_id);
        expect(eventblock.event_id).toEqual(eventblockDtoMock.event_id);
    });

    it('Updates eventblock with given property values', async () => {
        let eventblockMock = new Eventblock();
        eventblockMock.block_id = 1;
        eventblockMock.category_id = 2;
        eventblockMock.event_id = 3;

        let eventblockDtoMock = {
            block_id: 4,
            category_id: 5,
            event_id: 6
        };

        let eventblockRepositoryFindOneByIdSpy = spyOn(eventblockRepository, 'findOneById').and.returnValue(eventblockMock);
        let eventblockRepositorySaveSpy = spyOn(eventblockRepository, 'save').and.returnValue(eventblockMock);
        let eventblock = await eventblocksService.update(1, eventblockDtoMock);

        expect(eventblockRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(eventblockRepositorySaveSpy).toHaveBeenCalledWith(eventblockMock);
        
        expect(eventblock).toEqual(eventblockMock);
        expect(eventblock.block_id).toEqual(eventblockDtoMock.block_id);
        expect(eventblock.category_id).toEqual(eventblockDtoMock.category_id);
        expect(eventblock.event_id).toEqual(eventblockDtoMock.event_id);
    });

    it('Updates eventblock with no property values', async () => {
        let eventblockMock = new Eventblock();
        eventblockMock.block_id = 1;
        eventblockMock.category_id = 2;
        eventblockMock.event_id = 3;

        let eventblockDtoMock = { };

        let eventblockRepositoryFindOneByIdSpy = spyOn(eventblockRepository, 'findOneById').and.returnValue(eventblockMock);
        let eventblockRepositorySaveSpy = spyOn(eventblockRepository, 'save').and.returnValue(eventblockMock);
        let eventblock = await eventblocksService.update(1, eventblockDtoMock);

        expect(eventblockRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(eventblockRepositorySaveSpy).toHaveBeenCalledWith(eventblockMock);
        
        expect(eventblock).toEqual(eventblockMock);
        expect(eventblock.block_id).toEqual(eventblockMock.block_id);
        expect(eventblock.category_id).toEqual(eventblockMock.category_id);
        expect(eventblock.event_id).toEqual(eventblockMock.event_id);
    });

    it('Deletes eventblock with given id using repository', async () => {
        let eventblockRepositoryDeleteSpy = spyOn(eventblockRepository, 'delete');
        await eventblocksService.delete(1);
        expect(eventblockRepositoryDeleteSpy).toHaveBeenCalledWith({ id: 1 });
    });

    it('Merges two event blocks when name, numbered and seatplan properties are equal', async () => {
        let eventblockMock1 = new Eventblock();
        eventblockMock1.id = 1;
        let blockMock1 = new Block();
        blockMock1.name = 'a';
        blockMock1.numbered = true;
        blockMock1.seatplan_image_data_url = 'u';

        let eventblockMock2 = new Eventblock();
        eventblockMock2.id = 2;
        let blockMock2 = new Block();
        blockMock2.name = 'a';
        blockMock2.numbered = true;
        blockMock2.seatplan_image_data_url = 'u';

        let eventblockRepositoryFindSpy = spyOn(eventblockRepository, 'find').and.returnValue([ eventblockMock1, eventblockMock2 ]);
        let blockRepositoryFindOneByIdSpy = spyOn(blockRepository, 'findOneById').and.returnValues(blockMock1, blockMock2);
        let thinMergedEventblocks = await eventblocksService.getThinMergedEventblocks(1);

        expect(eventblockRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(blockRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(2);
        expect(thinMergedEventblocks.length).toEqual(1);
        expect(thinMergedEventblocks[0].id).toContain('1');
        expect(thinMergedEventblocks[0].id).toContain('2');
        expect(thinMergedEventblocks[0].name).toEqual('a');
        expect(thinMergedEventblocks[0].numbered).toEqual(true);
    });

    it('Merges two event blocks which are at the beginning and at the end of the list', async () => {
        let eventblockMock1 = new Eventblock();
        eventblockMock1.id = 1;
        let blockMock1 = new Block();
        blockMock1.name = 'a';
        blockMock1.numbered = true;
        blockMock1.seatplan_image_data_url = 'u';

        let eventblockMock2 = new Eventblock();
        eventblockMock2.id = 2;
        let blockMock2 = new Block();
        blockMock2.name = 'B';
        blockMock2.numbered = true;
        blockMock2.seatplan_image_data_url = 'u';

        let eventblockMock3 = new Eventblock();
        eventblockMock3.id = 3;
        let blockMock3 = new Block();
        blockMock3.name = 'a';
        blockMock3.numbered = true;
        blockMock3.seatplan_image_data_url = 'u';

        let eventblockRepositoryFindSpy = spyOn(eventblockRepository, 'find').and.returnValue([ eventblockMock1, eventblockMock2, eventblockMock3 ]);
        let blockRepositoryFindOneByIdSpy = spyOn(blockRepository, 'findOneById').and.returnValues(blockMock1, blockMock2, blockMock3);
        let thinMergedEventblocks = await eventblocksService.getThinMergedEventblocks(1);

        expect(eventblockRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(blockRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(3);
        expect(thinMergedEventblocks.length).toEqual(2);
        expect(thinMergedEventblocks.map(b => b.id)).toContain("1-3");
        expect(thinMergedEventblocks.map(b => b.id)).toContain("2");
    });

    it('Does not merge two event blocks when name is not equal', async () => {
        let blockMock1 = new Block();
        blockMock1.name = 'a';
        blockMock1.numbered = true;
        blockMock1.seatplan_image_data_url = 'u';

        let blockMock2 = new Block();
        blockMock2.name = 'b';
        blockMock2.numbered = true;
        blockMock2.seatplan_image_data_url = 'u';

        let eventblockRepositoryFindSpy = spyOn(eventblockRepository, 'find').and.returnValue([ new Eventblock(), new Eventblock() ]);
        let blockRepositoryFindOneByIdSpy = spyOn(blockRepository, 'findOneById').and.returnValues(blockMock1, blockMock2);
        let thinMergedEventblocks = await eventblocksService.getThinMergedEventblocks(1);

        expect(eventblockRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(blockRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(2);
        expect(thinMergedEventblocks.length).toEqual(2);
    });

    it('Does not merge two event blocks when numbered is not equal', async () => {
        let eventblockMock1 = new Eventblock();
        eventblockMock1.id = 1;
        let blockMock1 = new Block();
        blockMock1.name = 'a';
        blockMock1.numbered = true;
        blockMock1.seatplan_image_data_url = 'u';

        let eventblockMock2 = new Eventblock();
        eventblockMock2.id = 2;
        let blockMock2 = new Block();
        blockMock2.name = 'a';
        blockMock2.numbered = false;
        blockMock2.seatplan_image_data_url = 'u';

        let eventblockRepositoryFindSpy = spyOn(eventblockRepository, 'find').and.returnValue([ eventblockMock1, eventblockMock2 ]);
        let blockRepositoryFindOneByIdSpy = spyOn(blockRepository, 'findOneById').and.returnValues(blockMock1, blockMock2);
        let thinMergedEventblocks = await eventblocksService.getThinMergedEventblocks(1);

        expect(eventblockRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(blockRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(2);
        expect(thinMergedEventblocks.length).toEqual(2);
    });

    it('Does not merge two event blocks when seatplan_image_data_url are not equal', async () => {
        let eventblockMock1 = new Eventblock();
        eventblockMock1.id = 1;
        let blockMock1 = new Block();
        blockMock1.name = 'a';
        blockMock1.numbered = true;
        blockMock1.seatplan_image_data_url = 'u';

        let eventblockMock2 = new Eventblock();
        eventblockMock2.id = 2;
        let blockMock2 = new Block();
        blockMock2.name = 'a';
        blockMock2.numbered = true;
        blockMock2.seatplan_image_data_url = 'v';

        let eventblockRepositoryFindSpy = spyOn(eventblockRepository, 'find').and.returnValue([ eventblockMock1, eventblockMock2 ]);
        let blockRepositoryFindOneByIdSpy = spyOn(blockRepository, 'findOneById').and.returnValues(blockMock1, blockMock2);
        let thinMergedEventblocks = await eventblocksService.getThinMergedEventblocks(1);

        expect(eventblockRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(blockRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(2);
        expect(thinMergedEventblocks.length).toEqual(2);
    });

    it('Returns merged event block for given key', async () => {
        let eventMock = new Event();
        let categoryMock1 = new Category();
        let categoryMock2 = new Category();

        let eventblockMock1 = new Eventblock();
        eventblockMock1.id = 1;
        eventblockMock1.block_id = 11;
        eventblockMock1.event_id = 21;
        eventblockMock1.category_id = 31;

        let blockMock1 = new Block();
        blockMock1.name = 'a';
        blockMock1.numbered = true;
        blockMock1.seatplan_image_data_url = 'u';

        let seatMock11 = new Seat();
        let augmentedSeatMock11 = new AugmentedSeat(seatMock11, SeatState.Free);
        let seatMock12 = new Seat();
        let augmentedSeatMock12 = new AugmentedSeat(seatMock12, SeatState.Free);

        let eventblockMock2 = new Eventblock();
        eventblockMock2.id = 2;
        eventblockMock2.block_id = 12;
        eventblockMock2.event_id = 21;
        eventblockMock2.category_id = 32;

        let blockMock2 = new Block();
        blockMock2.name = 'a';
        blockMock2.numbered = true;
        blockMock2.seatplan_image_data_url = 'u';

        let seatMock21 = new Seat();
        let augmentedSeatMock21 = new AugmentedSeat(seatMock21, SeatState.Free);
        let seatMock22 = new Seat();
        let augmentedSeatMock22 = new AugmentedSeat(seatMock22, SeatState.Free);

        let eventblockRepositoryFindOneByIdSpy = spyOn(eventblockRepository, 'findOneById').and.returnValues(eventblockMock1, eventblockMock2);
        let blockRepositoryFindOneByIdSpy = spyOn(blockRepository, 'findOneById').and.returnValues(blockMock1, blockMock2);
        let eventRepositoryFindOneByIdSpy = spyOn(eventRepository, 'findOneById').and.returnValue(eventMock);
        let categoryRepositoryFindOneByIdSpy = spyOn(categoryRepository, 'findOneById').and.returnValues(categoryMock1, categoryMock2);
        let seatRepositoryFindSpy = spyOn(seatRepository, 'find').and.returnValues([ seatMock11, seatMock12 ], [ seatMock21, seatMock22 ]);
        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValues(undefined, undefined, undefined, undefined);
        
        let mergedEventblock = await eventblocksService.getMergedEventblock('1-2', 'token');

        expect(mergedEventblock.id).toContain('1');
        expect(mergedEventblock.id).toContain('2');
        expect(mergedEventblock.name).toEqual('a');
        expect(mergedEventblock.numbered).toEqual(true);
        expect(mergedEventblock.seatplan_image_data_url).toEqual('u');
        expect(mergedEventblock.event).toEqual(eventMock);
        expect(mergedEventblock.parts).toContain(new MergedEventblockPart(1, categoryMock1, [ augmentedSeatMock11, augmentedSeatMock12 ]));
        expect(mergedEventblock.parts).toContain(new MergedEventblockPart(2, categoryMock2, [ augmentedSeatMock21, augmentedSeatMock22 ]));
    });

    it('Returns undefined when an event block cannot be found', async () => {
        let eventMock = new Event();
        let categoryMock1 = new Category();
        
        let eventblockMock1 = new Eventblock();
        eventblockMock1.id = 1;
        eventblockMock1.block_id = 11;
        eventblockMock1.event_id = 21;
        eventblockMock1.category_id = 31;

        let blockMock1 = new Block();
        blockMock1.name = 'a';
        blockMock1.numbered = true;
        blockMock1.seatplan_image_data_url = 'u';

        let seatMock11 = new Seat();
        let augmentedSeatMock11 = new AugmentedSeat(seatMock11, SeatState.Free);
        let seatMock12 = new Seat();
        let augmentedSeatMock12 = new AugmentedSeat(seatMock12, SeatState.Free);

        let eventblockRepositoryFindOneByIdSpy = spyOn(eventblockRepository, 'findOneById').and.returnValues(eventblockMock1, undefined);
        let blockRepositoryFindOneByIdSpy = spyOn(blockRepository, 'findOneById').and.returnValue(blockMock1);
        let eventRepositoryFindOneByIdSpy = spyOn(eventRepository, 'findOneById').and.returnValue(eventMock);
        let categoryRepositoryFindOneByIdSpy = spyOn(categoryRepository, 'findOneById').and.returnValue(categoryMock1);
        let seatRepositoryFindSpy = spyOn(seatRepository, 'find').and.returnValue([ seatMock11, seatMock12 ]);
        let reservationRepositoryFindOneSpy = spyOn(reservationRepository, 'findOne').and.returnValues(undefined, undefined);
        
        let mergedEventblock = await eventblocksService.getMergedEventblock('1-2', 'token');
        expect(mergedEventblock).toEqual(undefined);
    });
});