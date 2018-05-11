import { Repository } from 'typeorm';
import { Seat } from '../seat/seat.entity';
import { Block, BlockDto } from './block.entity';
import { BlocksService } from './blocks.service';

describe('BlocksService', () => {
    let blockRepository: Repository<Block>;
    let blocksService: BlocksService;

    beforeEach(() => {
        blockRepository = new Repository<Block>();
        blocksService = new BlocksService(blockRepository);
    });

    it('Fetches all blocks from repository', async () => {
        const blockMock = new Block();
        const blockRepositoryFindSpy = spyOn(blockRepository, 'find').and.returnValue([blockMock]);
        const blocks = await blocksService.findAll();
        expect(blockRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(blocks).toEqual([blockMock]);
    });

    it('Fetches block with given id from repository', async () => {
        const blockMock = new Block();
        const blockRepositoryfindOneSpy = spyOn(blockRepository, 'findOne').and.returnValue(blockMock);
        const block = await blocksService.find(1);
        expect(blockRepositoryfindOneSpy).toHaveBeenCalledWith({ id: 1 });
        expect(block).toEqual(blockMock);
    });

    it('Creates block with given property values', async () => {
        const blockMock = new Block();
        const blockDtoMock = {
            name: 'dto.name',
            numbered: true,
            seatplan_image_data_url: 'dto.url'
        };

        const blockRepositoryCreateSpy = spyOn(blockRepository, 'create').and.returnValue(blockMock);
        const blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        const block = await blocksService.create(blockDtoMock);

        expect(blockRepositoryCreateSpy).toHaveBeenCalledTimes(1);
        expect(blockRepositorySaveSpy).toHaveBeenCalledWith(blockMock);

        expect(block).toEqual(blockMock);
        expect(block.name).toEqual(blockDtoMock.name);
        expect(block.numbered).toEqual(blockDtoMock.numbered);
        expect(block.seatplan_image_data_url).toEqual(blockDtoMock.seatplan_image_data_url);
    });

    it('Updates block with given property values', async () => {
        const blockMock = new Block();
        blockMock.name = 'model.name';
        blockMock.numbered = true;
        blockMock.seatplan_image_data_url = 'model.url';

        const blockDtoMock = {
            name: 'dto.name',
            numbered: true,
            seatplan_image_data_url: 'dto.url'
        };

        const blockRepositoryfindOneSpy = spyOn(blockRepository, 'findOne').and.returnValue(blockMock);
        const blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        const block = await blocksService.update(1, blockDtoMock);

        expect(blockRepositoryfindOneSpy).toHaveBeenCalledTimes(1);
        expect(blockRepositorySaveSpy).toHaveBeenCalledWith(blockMock);

        expect(block).toEqual(blockMock);
        expect(block.name).toEqual(blockDtoMock.name);
        expect(block.numbered).toEqual(blockDtoMock.numbered);
        expect(block.seatplan_image_data_url).toEqual(blockDtoMock.seatplan_image_data_url);
    });

    it('Updates block with false numbered', async () => {
        const blockMock = new Block();
        blockMock.numbered = true;

        const blockDtoMock = {
            numbered: false
        };

        const blockRepositoryfindOneSpy = spyOn(blockRepository, 'findOne').and.returnValue(blockMock);
        const blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        const block = await blocksService.update(1, blockDtoMock);

        expect(block.numbered).toEqual(blockDtoMock.numbered);
    });

    it('Updates block with no numbered', async () => {
        const blockMock = new Block();
        blockMock.numbered = true;

        const blockDtoMock = { };

        const blockRepositoryfindOneSpy = spyOn(blockRepository, 'findOne').and.returnValue(blockMock);
        const blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        const block = await blocksService.update(1, blockDtoMock);

        expect(block.numbered).toEqual(blockMock.numbered);
    });

    it('Deletes block with given id using repository', async () => {
        const blockRepositoryDeleteSpy = spyOn(blockRepository, 'delete');
        await blocksService.delete(1);
        expect(blockRepositoryDeleteSpy).toHaveBeenCalledWith({ id: 1 });
    });
});