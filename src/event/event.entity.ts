import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ThinMergedEventblockInterface } from '../eventblock/eventblock.entity';

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    location: string;

    @Column({nullable: true})
    location_address: string;

    @Column({nullable: true})
    location_directions_public_transport: string;

    @Column({nullable: true})
    location_directions_car: string;

    @Column({nullable: true})
    dateandtime: string;

    @Column()
    visible: boolean;

    updateFromDto(dto: EventDto): void {
        if (dto.name !== undefined) {
            this.name = dto.name;
        }
        if (dto.location !== undefined) {
            this.location = dto.location;
        }
        if (dto.location_address !== undefined) {
            this.location_address = dto.location_address;
        }
        if (dto.location_directions_public_transport !== undefined) {
            this.location_directions_public_transport = dto.location_directions_public_transport;
        }
        if (dto.location_directions_car !== undefined) {
            this.location_directions_car = dto.location_directions_car;
        }
        if (dto.dateandtime !== undefined) {
            this.dateandtime = dto.dateandtime;
        }
        if (dto.visible !== undefined) {
            this.visible = dto.visible;
        }
    }
}

export interface EventDto {
    name?: string;
    location?: string;
    location_address?: string;
    location_directions_public_transport?: string;
    location_directions_car?: string;
    dateandtime?: string;
    visible?: boolean;
}

export class EventWithBlocks {
    constructor(event: Event, blocks: ThinMergedEventblockInterface[]) {
        this.event = event;
        this.blocks = blocks;
    }
    event: Event;
    blocks: ThinMergedEventblockInterface[];
}