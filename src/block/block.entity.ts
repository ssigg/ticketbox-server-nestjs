import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Event } from '../event/event.entity';
import { Category } from '../category/category.entity';
import { Seat } from '../seat/seat.entity';

@Entity()
export class Block implements ThinBlock {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    numbered: boolean;

    @Column({nullable: true})
    seatplan_image_data_url: string;

    updateFromDto(dto: BlockDto): void {
        if (dto.name !== undefined) {
            this.name = dto.name;
        }
        if (dto.numbered !== undefined) {
            this.numbered = dto.numbered;
        }
        if (dto.seatplan_image_data_url !== undefined) {
            this.seatplan_image_data_url = dto.seatplan_image_data_url;
        }
    }
}

export interface BlockDto {
    name?: string;
    numbered?: boolean;
    seatplan_image_data_url?: string;
}

export interface ThinBlock {
    id: number;
    name: string;
    numbered: boolean;
}