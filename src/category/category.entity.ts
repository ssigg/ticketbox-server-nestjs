import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { DtoInterface } from "../dto.interface";

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
}

export class CategoryDto implements DtoInterface<Category> {
    name?: string;
    color?: string;
    price?: number;
    price_reduced?: number;
    
    updateModel(model: Category): void {
        if (this.name !== undefined) {
            model.name = this.name;
        }
        if (this.color !== undefined) {
            model.color = this.color;
        }
        if (this.price !== undefined) {
            model.price = this.price;
        }
        if (this.price_reduced !== undefined) {
            model.price_reduced = this.price_reduced;
        }
    }
}