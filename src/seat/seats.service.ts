
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Event } from '../event/event.entity';
import { Seat, SeatDto, AugmentedSeat, SeatState } from './seat.entity';
import { Component } from '@nestjs/common';
import { Reservation, OrderKind } from '../reservation/reservation.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

@Component()
export class SeatsService {
    constructor(
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>,
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>
    ) { }

    async findAllInBlock(blockId: number): Promise<Seat[]> {
        return await this.seatRepository.find({ block_id: blockId });
    }

    async create(dtos: SeatDto[]): Promise<Seat[]> {
        const savedSeats = await Promise.all(dtos.map(async dto => this.createOneSeat(dto)));
        return savedSeats;
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.seatRepository.delete({ id: id });
    }

    async augmentSeat(seat: Seat, event: Event, token: string): Promise<AugmentedSeat> {
        const reservation = await this.reservationRepository.findOne({ seat_id: seat.id, event_id: event.id });

        if (reservation === undefined) {
            return new AugmentedSeat(seat, SeatState.Free);
        } else if (reservation.order_id !== null) {
            if (reservation.order_kind === OrderKind.Reservation) {
                return new AugmentedSeat(seat, SeatState.Ordered);
            } else if (reservation.order_kind === OrderKind.BoxofficePurchase) {
                return new AugmentedSeat(seat, SeatState.Sold);
            } else if (reservation.order_kind === OrderKind.CustomerPurchase) {
                return new AugmentedSeat(seat, SeatState.Sold);
            } else {
                throw Error('Unknown order kind: ' + reservation.order_kind);
            }
        } else if (reservation.token === token) {
            return new AugmentedSeat(seat, SeatState.ReservedByMyself, reservation.id);
        } else {
            return new AugmentedSeat(seat, SeatState.Reserved);
        }
    }

    private async createOneSeat(dto: SeatDto): Promise<Seat> {
        const seat = await this.seatRepository.create();
        seat.updateFromDto(dto);
        const savedSeat = await this.seatRepository.save(seat);
        return savedSeat;
    }
}