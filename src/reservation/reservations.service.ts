import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not, IsNull } from "typeorm";
import { CreateReservationDto, Reservation, UpdateReductionReservationDto, AddToOrderReservationDto, AugmentedReservation } from "./reservation.entity";
import { Event } from "../event/event.entity";
import { Seat } from "../seat/seat.entity";
import { Category } from "../category/category.entity";
import { UuidFactory } from "../utils/uuid.factory";
import { DeleteResult } from "typeorm/query-builder/result/DeleteResult";

@Component()
export class ReservationsService {
    constructor(
        @InjectRepository(Reservation)
        private readonly reservationRepository: Repository<Reservation>,
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        @InjectRepository(Seat)
        private readonly seatRepository: Repository<Seat>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly uuidFactory: UuidFactory
    ) { }

    async findMyReservations(token: string): Promise<AugmentedReservation[]> {
        let reservations = await this.reservationRepository.find({ token: token });
        let augmentedReservations = await Promise.all(reservations.map(async r => await this.augmentReservation(r)));
        return augmentedReservations;
    }

    async findAllOrderedReservations(): Promise<AugmentedReservation[]> {
        let reservations = await this.reservationRepository.find({ order_id: Not(IsNull()) });
        let augmentedReservations = await Promise.all(reservations.map(async r => await this.augmentReservation(r)));
        return augmentedReservations;
    }

    async create(event_id: number, seat_id: number, category_id: number, token: string, timestamp: number): Promise<AugmentedReservation> {
        let dto = {
            event_id: event_id,
            seat_id: seat_id,
            category_id: category_id,
            token: token,
            unique_id: this.uuidFactory.create(),
            is_reduced: false,
            is_scanned: false,
            timestamp: timestamp
        };

        let reservation = await this.reservationRepository.create();
        reservation.updateFromCreationDto(dto);
        let savedReservation = await this.reservationRepository.save(reservation);
        let augmentedReservation = await this.augmentReservation(savedReservation);
        return augmentedReservation;
    }

    async updateReduction(id: number, token: string, dto: UpdateReductionReservationDto): Promise<AugmentedReservation> {
        let reservation = await this.reservationRepository.findOne({ id: id, token: token, order_id: IsNull() });
        if (reservation !== undefined) {
            reservation.updateFromUpdateReductionDto(dto);
            let savedReservation = await this.reservationRepository.save(reservation);
            let augmentedReservation = await this.augmentReservation(savedReservation);
            return augmentedReservation;
        } else {
            return undefined;
        }
    }

    async addToOrder(id: number, token: string, dto: AddToOrderReservationDto): Promise<AugmentedReservation> {
        let reservation = await this.reservationRepository.findOne({ id: id, token: token, order_id: IsNull() });
        if (reservation !== undefined) {
            reservation.updateFromAddToOrderDto(dto);
            let savedReservation = await this.reservationRepository.save(reservation);
            let augmentedReservation = await this.augmentReservation(savedReservation);
            return augmentedReservation;
        } else {
            return undefined;
        }
    }

    async delete(id: number): Promise<DeleteResult> {
        return await this.reservationRepository.delete({ id: id });
    }

    async purgeReservations(token: string): Promise<DeleteResult> {
        return await this.reservationRepository.delete({ token: token, order_id: IsNull() });
    }

    private async augmentReservation(reservation: Reservation): Promise<AugmentedReservation> {
        let event = await this.eventRepository.findOne({ id: reservation.event_id });
        let seat = await this.seatRepository.findOne({ id: reservation.seat_id });
        let category = await this.categoryRepository.findOne({ id: reservation.category_id });
        let price = reservation.is_reduced ? category.price_reduced : category.price;
        return new AugmentedReservation(reservation.id, reservation.unique_id, event, seat, category, reservation.is_reduced, price, reservation.order_id, reservation.timestamp);
    }
}