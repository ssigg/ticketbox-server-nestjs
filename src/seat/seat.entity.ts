import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Seat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    block_id: number;

    @Column()
    name: string;

    @Column({ nullable: true, type: "real" })
    x0: number;

    @Column({ nullable: true, type: "real" })
    y0: number;

    @Column({ nullable: true, type: "real" })
    x1: number;

    @Column({ nullable: true, type: "real" })
    y1: number;

    @Column({ nullable: true, type: "real" })
    x2: number;

    @Column({ nullable: true, type: "real" })
    y2: number;

    @Column({ nullable: true, type: "real" })
    x3: number;

    @Column({ nullable: true, type: "real" })
    y3: number;

    updateFromDto(dto: SeatDto): void {
        this.block_id = dto.block_id;
        this.name = dto.name;
        
        if (dto.x0 !== undefined) {
            this.x0 = dto.x0;
        }
        if (dto.y0 !== undefined) {
            this.y0 = dto.y0;
        }
        if (dto.x1 !== undefined) {
            this.x1 = dto.x1;
        }
        if (dto.y1 !== undefined) {
            this.y1 = dto.y1;
        }
        if (dto.x2 !== undefined) {
            this.x2 = dto.x2;
        }
        if (dto.y2 !== undefined) {
            this.y2 = dto.y2;
        }
        if (dto.x3 !== undefined) {
            this.x3 = dto.x3;
        }
        if (dto.y3 !== undefined) {
            this.y3 = dto.y3;
        }
    }
}

export interface SeatDto {
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