import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Block, BlockDto, ThinBlock } from './block.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

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
        return await this.blockRepository.findOne({ id: id });
    }

    async create(dto: BlockDto): Promise<Block> {
        const block = await this.blockRepository.create();
        block.updateFromDto(dto);
        const savedBlock = await this.blockRepository.save(block);
        return savedBlock;
    }

    async update(id: number, dto: BlockDto): Promise<Block> {
        const block = await this.blockRepository.findOne({ id: id });
        block.updateFromDto(dto);
        const savedBlock = await this.blockRepository.save(block);
        return savedBlock;
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.blockRepository.delete({ id });
    }
}