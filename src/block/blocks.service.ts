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
        let eventblocksWithBlocks = await Promise.all(eventblocks.map(async eb => {
            let block = await this.blockRepository.findOneById(eb.block_id);
            return { eventblock: eb, block: block };
        }));

        let mergedEventblocks: MergedEventblock[] = [];
        eventblocksWithBlocks.forEach(eb => {
            let matching = mergedEventblocks.find(mb => mb.name == eb.block.name && mb.numbered == eb.block.numbered && mb.seatplan_image_data_url == eb.block.seatplan_image_data_url)
            if (matching !== undefined) { // we found a block to merge
                matching.id = matching.id + '-' + eb.block.id;
            } else { // no block found, create a new one
                mergedEventblocks.push(new MergedEventblock('' + eb.block.id, eb.block.name, eb.block.numbered, null, eb.block.seatplan_image_data_url, []));
            }
        });
        return mergedEventblocks;
    }
}