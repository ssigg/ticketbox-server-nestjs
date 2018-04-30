import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    color: string;

    @Column()
    price: number;

    @Column()
    price_reduced: number;

    updateFromDto(dto: CategoryDto): void {
        if (dto.name !== undefined) {
            this.name = dto.name;
        }
        if (dto.color !== undefined) {
            this.color = dto.color;
        }
        if (dto.price !== undefined) {
            this.price = dto.price;
        }
        if (dto.price_reduced !== undefined) {
            this.price_reduced = dto.price_reduced;
        }
    }
}

export interface CategoryDto {
    name?: string;
    color?: string;
    price?: number;
    price_reduced?: number;
}