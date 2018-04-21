import { Repository } from "typeorm";
import { Event } from "../event/event.entity";
import { Category } from "../category/category.entity";
import { Seat } from "../seat/seat.entity";
import { Block, BlockDto, Eventblock, EventblockDto } from "./block.entities";
import { BlocksService } from "./blocks.service";

describe('BlocksService', () => {
    let eventRepository: Repository<Event>;
    let categoryRepository: Repository<Category>;
    let blockRepository: Repository<Block>;
    let eventblockRepository: Repository<Eventblock>;
    let seatRepository: Repository<Seat>;
    let blocksService: BlocksService;

    beforeEach(() => {
        eventRepository = new Repository<Event>();
        categoryRepository = new Repository<Category>();
        blockRepository = new Repository<Block>();
        eventblockRepository = new Repository<Eventblock>();
        seatRepository = new Repository<Seat>();
        blocksService = new BlocksService(eventRepository, categoryRepository, blockRepository, eventblockRepository, seatRepository);
    });

    it('Creates block with given property values', async () => {
        let blockMock = new Block();
        let blockDtoMock = new BlockDto();
        blockDtoMock.name = 'dto.name';
        blockDtoMock.numbered = true;
        blockDtoMock.seatplan_image_data_url = 'dto.url';

        let blockRepositoryCreateSpy = spyOn(blockRepository, 'create').and.returnValue(blockMock);
        let blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        let block = await blocksService.createBlock(blockDtoMock);
        
        expect(blockRepositoryCreateSpy).toHaveBeenCalledTimes(1);
        expect(blockRepositorySaveSpy).toHaveBeenCalledWith(blockMock);
        
        expect(block).toEqual(blockMock);
        expect(block.name).toEqual(blockDtoMock.name);
        expect(block.numbered).toEqual(blockDtoMock.numbered);
        expect(block.seatplan_image_data_url).toEqual(blockDtoMock.seatplan_image_data_url);
    });

    it('Updates block with given property values', async () => {
        let blockMock = new Block();
        blockMock.name = 'model.name';
        blockMock.numbered = true;
        blockMock.seatplan_image_data_url = 'model.url';

        let blockDtoMock = new BlockDto();
        blockDtoMock.name = 'dto.name';
        blockDtoMock.numbered = true;
        blockDtoMock.seatplan_image_data_url = 'dto.url';

        let blockRepositoryFindOneByIdSpy = spyOn(blockRepository, 'findOneById').and.returnValue(blockMock);
        let blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        let block = await blocksService.updateBlock(1, blockDtoMock);

        expect(blockRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(blockRepositorySaveSpy).toHaveBeenCalledWith(blockMock);
        
        expect(block).toEqual(blockMock);
        expect(block.name).toEqual(blockDtoMock.name);
        expect(block.numbered).toEqual(blockDtoMock.numbered);
        expect(block.seatplan_image_data_url).toEqual(blockDtoMock.seatplan_image_data_url);
    });

    it('Updates block with false numbered', async () => {
        let blockMock = new Block();
        blockMock.numbered = true;

        let blockDtoMock = new BlockDto();
        blockDtoMock.numbered = false;

        let blockRepositoryFindOneByIdSpy = spyOn(blockRepository, 'findOneById').and.returnValue(blockMock);
        let blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        let block = await blocksService.updateBlock(1, blockDtoMock);
        
        expect(block.numbered).toEqual(blockDtoMock.numbered);
    });

    it('Updates block with no numbered', async () => {
        let blockMock = new Block();
        blockMock.numbered = true;

        let blockDtoMock = new BlockDto();

        let blockRepositoryFindOneByIdSpy = spyOn(blockRepository, 'findOneById').and.returnValue(blockMock);
        let blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        let block = await blocksService.updateBlock(1, blockDtoMock);
        
        expect(block.numbered).toEqual(blockMock.numbered);
    });

    it('Deletes block with given id using repository', async () => {
        let blockRepositoryDeleteSpy = spyOn(blockRepository, 'delete');
        await blocksService.deleteBlock(1);
        expect(blockRepositoryDeleteSpy).toHaveBeenCalledWith({ id: 1 });
    });

    it('Creates eventblock with given property values', async () => {
        let eventblockMock = new Eventblock();
        let eventblockDtoMock = new EventblockDto();
        eventblockDtoMock.block_id = 1;
        eventblockDtoMock.category_id = 2;
        eventblockDtoMock.event_id = 3;

        let eventblockRepositoryCreateSpy = spyOn(eventblockRepository, 'create').and.returnValue(eventblockMock);
        let eventblockRepositorySaveSpy = spyOn(eventblockRepository, 'save').and.returnValue(eventblockMock);
        let eventblock = await blocksService.createEventblock(eventblockDtoMock);
        
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

        let eventblockDtoMock = new EventblockDto();
        eventblockDtoMock.block_id = 4;
        eventblockDtoMock.category_id = 5;
        eventblockDtoMock.event_id = 6;

        let eventblockRepositoryFindOneByIdSpy = spyOn(eventblockRepository, 'findOneById').and.returnValue(eventblockMock);
        let eventblockRepositorySaveSpy = spyOn(eventblockRepository, 'save').and.returnValue(eventblockMock);
        let eventblock = await blocksService.updateEventblock(1, eventblockDtoMock);

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

        let eventblockDtoMock = new EventblockDto();

        let eventblockRepositoryFindOneByIdSpy = spyOn(eventblockRepository, 'findOneById').and.returnValue(eventblockMock);
        let eventblockRepositorySaveSpy = spyOn(eventblockRepository, 'save').and.returnValue(eventblockMock);
        let eventblock = await blocksService.updateEventblock(1, eventblockDtoMock);

        expect(eventblockRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(1);
        expect(eventblockRepositorySaveSpy).toHaveBeenCalledWith(eventblockMock);
        
        expect(eventblock).toEqual(eventblockMock);
        expect(eventblock.block_id).toEqual(eventblockMock.block_id);
        expect(eventblock.category_id).toEqual(eventblockMock.category_id);
        expect(eventblock.event_id).toEqual(eventblockMock.event_id);
    });

    it('Deletes eventblock with given id using repository', async () => {
        let eventblockRepositoryDeleteSpy = spyOn(eventblockRepository, 'delete');
        await blocksService.deleteEventblock(1);
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
        let thinMergedEventblocks = await blocksService.getThinMergedEventblocks(1);

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
        let thinMergedEventblocks = await blocksService.getThinMergedEventblocks(1);

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
        let thinMergedEventblocks = await blocksService.getThinMergedEventblocks(1);

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
        let thinMergedEventblocks = await blocksService.getThinMergedEventblocks(1);

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
        let thinMergedEventblocks = await blocksService.getThinMergedEventblocks(1);

        expect(eventblockRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(blockRepositoryFindOneByIdSpy).toHaveBeenCalledTimes(2);
        expect(thinMergedEventblocks.length).toEqual(2);
    });
});