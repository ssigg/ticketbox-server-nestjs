import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { DtoInterface } from "../dto.interface";

@Entity()
export class Seat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    block_id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    x0: number;

    @Column({nullable: true})
    y0: number;

    @Column({nullable: true})
    x1: number;

    @Column({nullable: true})
    y1: number;

    @Column({nullable: true})
    x2: number;

    @Column({nullable: true})
    y2: number;

    @Column({nullable: true})
    x3: number;

    @Column({nullable: true})
    y3: number;
}

export class SeatDto implements DtoInterface<Seat> {
    block_id: number;
    name: string;
    x0?: number;
    y0?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    x3?: number;
    y3?: number;
    
    updateModel(model: Seat): void {
        model.block_id = this.block_id;
        model.name = this.name;
        
        if (this.x0 !== undefined) {
            model.x0 = this.x0;
        }
        if (this.y0 !== undefined) {
            model.y0 = this.y0;
        }
        if (this.x1 !== undefined) {
            model.x1 = this.x1;
        }
        if (this.y1 !== undefined) {
            model.y1 = this.y1;
        }
        if (this.x2 !== undefined) {
            model.x2 = this.x2;
        }
        if (this.y2 !== undefined) {
            model.y2 = this.y2;
        }
        if (this.x3 !== undefined) {
            model.x3 = this.x3;
        }
        if (this.y3 !== undefined) {
            model.y3 = this.y3;
        }
    }
}

export class AugmentedSeat {
    constructor(seat: Seat, state: SeatState, reservation_id?: number) {
        this.seat = seat;
        this.state = state;
        this.reservation_id = reservation_id;
    }
    seat: Seat;
    state: SeatState;
    reservation_id?: number;
}

export enum SeatState {
    Free = 'free',
    Reserved = 'reserved',
    ReservedByMyself = 'reservedbymyself',
    Ordered = 'ordered',
    Sold = 'sold'
}