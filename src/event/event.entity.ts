import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { DtoInterface } from "../dto.interface";
import { ThinMergedEventblockInterface } from "../eventblock/eventblock.entity";

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
}

export class EventDto implements DtoInterface<Event> {
    name?: string;
    location?: string;
    location_address?: string;
    location_directions_public_transport?: string;
    location_directions_car?: string;
    dateandtime?: string;
    visible?: boolean;

    updateModel(model: Event): void {
        if (this.name !== undefined) {
            model.name = this.name;
        }
        if (this.location !== undefined) {
            model.location = this.location;
        }
        if (this.location_address !== undefined) {
            model.location_address = this.location_address;
        }
        if (this.location_directions_public_transport !== undefined) {
            model.location_directions_public_transport = this.location_directions_public_transport;
        }
        if (this.location_directions_car !== undefined) {
            model.location_directions_car = this.location_directions_car;
        }
        if (this.dateandtime !== undefined) {
            model.dateandtime = this.dateandtime;
        }
        if (this.visible !== undefined) {
            model.visible = this.visible;
        }
    }
}

export class EventWithBlocks {
    constructor(event: Event, blocks: ThinMergedEventblockInterface[]) {
        this.event = event;
        this.blocks = blocks;
    }
    event: Event;
    blocks: ThinMergedEventblockInterface[];
}