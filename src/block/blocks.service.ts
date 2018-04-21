import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { Block, BlockDto, ThinBlock } from "./block.entity";

@Component()
export class BlocksService {
    constructor(
        @InjectRepository(Block)
        private readonly blockRepository: Repository<Block>
    ) { }

    async findAll(): Promise<ThinBlock[]> {
        return await this.blockRepository.find();
    }

    async find(id: number): Promise<Block> {
        return await this.blockRepository.findOneById(id);
    }

    async create(dto: BlockDto): Promise<Block> {
        let block = await this.blockRepository.create();
        dto.updateModel(block);
        let savedBlock = await this.blockRepository.save(block);
        return savedBlock;
    }

    async update(id: number, dto: BlockDto): Promise<Block> {
        let block = await this.blockRepository.findOneById(id);
        dto.updateModel(block);
        let savedBlock = await this.blockRepository.save(block);
        return savedBlock;
    }

    async delete(id: number): Promise<void> {
        return await this.blockRepository.delete({ id: id });
    }
}