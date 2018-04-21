import { BlocksService } from "./blocks.service";
import { BlocksAdminController } from "./blocks.controller";
import { Block } from "./block.entity";

describe('EventsAdminController', () => {
    let blocksService: BlocksService;
    let blocksAdminController: BlocksAdminController;

    beforeEach(() => {
        blocksService = new BlocksService(null);
        blocksAdminController = new BlocksAdminController(blocksService);
    });

    it('Fetches all blocks from blocks service', async () => {
        let blockMock = new Block();
        let blocksServiceFindAllSpy = spyOn(blocksService, 'findAll').and.returnValue([ blockMock ]);
        let blocks = blocksAdminController.findAll();
        expect(blocksServiceFindAllSpy).toHaveBeenCalledTimes(1);
        expect(await blocks).toEqual([ blockMock ]);
    });

    it('Fetches block with given id from blocks service', async () => {
        let blockMock = new Block();
        let blockServiceFindSpy = spyOn(blocksService, 'find').and.returnValue(blockMock);
        let block = blocksAdminController.find({ id: 1 });
        expect(blockServiceFindSpy).toHaveBeenCalledWith(1);
        expect(await block).toEqual(blockMock);
    });

    it('Creates block using block service', async () => {
        let blockMock = new Block();
        let blocksServiceCreateSpy = spyOn(blocksService, 'create').and.returnValue(blockMock);
        let body = { name: 'name', numbered: true };
        let block = await blocksAdminController.create(body);
        expect(blocksServiceCreateSpy).toHaveBeenCalledWith(body);
        expect(block).toEqual(blockMock);
    });

    it('Updates block using block service', async () => {
        let blockMock = new Block();
        let blocksServiceUpdateSpy = spyOn(blocksService, 'update').and.returnValue(blockMock);
        let body = { name: 'name', numbered: false };
        let block = await blocksAdminController.update({ id: 1 }, body);
        expect(blocksServiceUpdateSpy).toHaveBeenCalledWith(1, body);
        expect(block).toEqual(blockMock);
    });

    it('Deletes a block using block service', () => {
        let blocksServiceDeleteSpy = spyOn(blocksService, 'delete');
        blocksAdminController.delete({ id: 1 });
        expect(blocksServiceDeleteSpy).toHaveBeenCalledTimes(1);
    });
});