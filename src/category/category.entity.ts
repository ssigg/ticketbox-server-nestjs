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
    price: string;

    @Column()
    price_reduced: string;
}

export class CategoryDto implements DtoInterface<Category> {
    name?: string;
    color?: string;
    price?: string;
    price_reduced?: string;
    
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