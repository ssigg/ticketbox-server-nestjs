import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { Block, Eventblock, BlockDto, EventblockDto, ThinMergedEventblock, MergedEventblock } from "./block.entities";

@Component()
export class BlocksService {
    constructor(
        @InjectRepository(Block)
        private readonly blockRepository: Repository<Block>,
        @InjectRepository(Eventblock)
        private readonly eventblockRepository: Repository<Eventblock>
    ) { }

    async createBlock(dto: BlockDto): Promise<Block> {
        let block = await this.blockRepository.create();
        dto.updateModel(block);
        let savedBlock = await this.blockRepository.save(block);
        return savedBlock;
    }

    async updateBlock(id: number, dto: BlockDto): Promise<Block> {
        let block = await this.blockRepository.findOneById(id);
        dto.updateModel(block);
        let savedBlock = await this.blockRepository.save(block);
        return savedBlock;
    }

    async deleteBlock(id: number): Promise<void> {
        return await this.blockRepository.delete({ id: id });
    }

    async createEventblock(dto: EventblockDto): Promise<Eventblock> {
        let eventblock = await this.eventblockRepository.create();
        dto.updateModel(eventblock);
        let savedEventblock = await this.eventblockRepository.save(eventblock);
        return savedEventblock;
    }

    async updateEventblock(id: number, dto: EventblockDto): Promise<Eventblock> {
        let eventblock = await this.eventblockRepository.findOneById(id);
        dto.updateModel(eventblock);
        let savedEventblock = await this.eventblockRepository.save(eventblock);
        return savedEventblock;
    }

    async deleteEventblock(id: number): Promise<void> {
        return await this.eventblockRepository.delete({ id: id });
    }

    async getThinMergedEventblocks(event_id: number): Promise<ThinMergedEventblock[]> {
        let eventblocks = await this.eventblockRepository.find({ event_id: event_id });
        let augmentedEventblocks = await Promise.all(eventblocks.map(async eb => await this.augmentEventblock(eb)));
        let mergedEventblocks = this.mergeAugmentedEventblocks(augmentedEventblocks);
        return mergedEventblocks;
    }

    private async augmentEventblock(eventBlock: Eventblock): Promise<{ eventblock: Eventblock, block: Block }> {
        let block = await this.blockRepository.findOneById(eventBlock.block_id);
        return { eventblock: eventBlock, block: block };
    }

    private mergeAugmentedEventblocks(eventblocksWithBlocks: { eventblock: Eventblock, block: Block }[]): MergedEventblock[] {
        let mergedEventblocks: MergedEventblock[] = [];
        eventblocksWithBlocks.forEach(eb => {
            let block = eb.block;
            let matching = mergedEventblocks.find(mb => this.canMerge(mb, block))
            if (matching !== undefined) { // we found a block to merge
                matching.id = matching.id + '-' + block.id;
            } else { // no block found, create a new one
                mergedEventblocks.push(new MergedEventblock('' + block.id, block.name, block.numbered, null, block.seatplan_image_data_url, []));
            }
        });
        return mergedEventblocks;
    }

    private canMerge(mergedEventblock: MergedEventblock, block: Block) {
        return mergedEventblock.name == block.name &&
               mergedEventblock.numbered == block.numbered &&
               mergedEventblock.seatplan_image_data_url == block.seatplan_image_data_url;
    }
}