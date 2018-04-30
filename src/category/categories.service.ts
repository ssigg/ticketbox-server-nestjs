import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm/repository/Repository";
import { Category, CategoryDto } from "./category.entity";

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
        return await this.categoryRepository.findOneById(id);
    }

    async create(dto: CategoryDto): Promise<Category> {
        let category = await this.categoryRepository.create();
        category.updateFromDto(dto);
        let savedCategory = await this.categoryRepository.save(category);
        return savedCategory;
    }

    async update(id: number, dto: CategoryDto): Promise<Category> {
        let category = await this.categoryRepository.findOneById(id);
        category.updateFromDto(dto);
        let savedCategory = await this.categoryRepository.save(category);
        return savedCategory;
    }

    async delete(id: number): Promise<void> {
        return await this.categoryRepository.delete({ id: id });
    }
}