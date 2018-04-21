import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { Block, Eventblock, BlockDto, EventblockDto } from "./block.entities";

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
}