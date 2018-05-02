import { Repository } from "typeorm";
import { Seat } from "../seat/seat.entity";
import { Block, BlockDto } from "./block.entity";
import { BlocksService } from "./blocks.service";

describe('BlocksService', () => {
    let blockRepository: Repository<Block>;
    let blocksService: BlocksService;

    beforeEach(() => {
        blockRepository = new Repository<Block>();
        blocksService = new BlocksService(blockRepository);
    });

    it('Fetches all blocks from repository', async () => {
        let blockMock = new Block();
        let blockRepositoryFindSpy = spyOn(blockRepository, 'find').and.returnValue([blockMock]);
        let blocks = await blocksService.findAll();
        expect(blockRepositoryFindSpy).toHaveBeenCalledTimes(1);
        expect(blocks).toEqual([blockMock]);
    });

    it('Fetches block with given id from repository', async () => {
        let blockMock = new Block();
        let blockRepositoryfindOneSpy = spyOn(blockRepository, 'findOne').and.returnValue(blockMock);
        let block = await blocksService.find(1);
        expect(blockRepositoryfindOneSpy).toHaveBeenCalledWith(1);
        expect(block).toEqual(blockMock);
    });

    it('Creates block with given property values', async () => {
        let blockMock = new Block();
        let blockDtoMock = {
            name: 'dto.name',
            numbered: true,
            seatplan_image_data_url: 'dto.url'
        };

        let blockRepositoryCreateSpy = spyOn(blockRepository, 'create').and.returnValue(blockMock);
        let blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        let block = await blocksService.create(blockDtoMock);
        
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

        let blockDtoMock = {
            name: 'dto.name',
            numbered: true,
            seatplan_image_data_url: 'dto.url'
        };

        let blockRepositoryfindOneSpy = spyOn(blockRepository, 'findOne').and.returnValue(blockMock);
        let blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        let block = await blocksService.update(1, blockDtoMock);

        expect(blockRepositoryfindOneSpy).toHaveBeenCalledTimes(1);
        expect(blockRepositorySaveSpy).toHaveBeenCalledWith(blockMock);
        
        expect(block).toEqual(blockMock);
        expect(block.name).toEqual(blockDtoMock.name);
        expect(block.numbered).toEqual(blockDtoMock.numbered);
        expect(block.seatplan_image_data_url).toEqual(blockDtoMock.seatplan_image_data_url);
    });

    it('Updates block with false numbered', async () => {
        let blockMock = new Block();
        blockMock.numbered = true;

        let blockDtoMock = {
            numbered: false
        };

        let blockRepositoryfindOneSpy = spyOn(blockRepository, 'findOne').and.returnValue(blockMock);
        let blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        let block = await blocksService.update(1, blockDtoMock);
        
        expect(block.numbered).toEqual(blockDtoMock.numbered);
    });

    it('Updates block with no numbered', async () => {
        let blockMock = new Block();
        blockMock.numbered = true;

        let blockDtoMock = { };

        let blockRepositoryfindOneSpy = spyOn(blockRepository, 'findOne').and.returnValue(blockMock);
        let blockRepositorySaveSpy = spyOn(blockRepository, 'save').and.returnValue(blockMock);
        let block = await blocksService.update(1, blockDtoMock);
        
        expect(block.numbered).toEqual(blockMock.numbered);
    });

    it('Deletes block with given id using repository', async () => {
        let blockRepositoryDeleteSpy = spyOn(blockRepository, 'delete');
        await blocksService.delete(1);
        expect(blockRepositoryDeleteSpy).toHaveBeenCalledWith({ id: 1 });
    });
});