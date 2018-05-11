import { Component } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Category, CategoryDto } from './category.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

@Component()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) { }

    async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find();
    }

    async find(id: number): Promise<Category> {
        return await this.categoryRepository.findOne({ id: id });
    }

    async create(dto: CategoryDto): Promise<Category> {
        const category = await this.categoryRepository.create();
        category.updateFromDto(dto);
        const savedCategory = await this.categoryRepository.save(category);
        return savedCategory;
    }

    async update(id: number, dto: CategoryDto): Promise<Category> {
        const category = await this.categoryRepository.findOne({ id: id });
        category.updateFromDto(dto);
        const savedCategory = await this.categoryRepository.save(category);
        return savedCategory;
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.categoryRepository.delete({ id: id });
    }
}