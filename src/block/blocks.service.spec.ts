import { Repository } from "typeorm";
import { Seat } from "../seat/seat.entity";
import { Block, BlockDto, Eventblock, EventblockDto } from "./block.entities";
import { BlocksService } from "./blocks.service";

describe('BlocksService', () => {
    let blockRepository: Repository<Block>;
    let eventblockRepository: Repository<Eventblock>;
    let blocksService: BlocksService;

    beforeEach(() => {
        blockRepository = new Repository<Block>();
        eventblockRepository = new Repository<Eventblock>();
        blocksService = new BlocksService(blockRepository, eventblockRepository);
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
});