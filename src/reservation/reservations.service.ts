import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReservationDto, Reservation, UpdateReductionReservationDto, AddToOrderReservationDto, AugmentedReservation } from "./reservation.entity";
import { Event } from "../event/event.entity";
import { Seat } from "../seat/seat.entity";
import { Category } from "../category/category.entity";
import { UuidFactory } from "../uuid.factory";

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

    async create(event_id: number, seat_id: number, category_id: number, token: string): Promise<AugmentedReservation> {
        let dto = new CreateReservationDto();
        dto.event_id = event_id;
        dto.seat_id = seat_id;
        dto.category_id = category_id;
        dto.token = token;
        dto.unique_id = this.uuidFactory.create();
        dto.is_reduced = false;
        dto.is_scanned = false;
        dto.timestamp = 0; // TODO (take from oldest reservation with this token)

        let reservation = await this.reservationRepository.create();
        dto.updateModel(reservation);
        let savedReservation = await this.reservationRepository.save(reservation);
        let augmentedReservation = await this.augmentReservation(savedReservation);
        return augmentedReservation;
    }

    async updateReduction(id: number, token: string, dto: UpdateReductionReservationDto): Promise<AugmentedReservation> {
        let reservation = await this.reservationRepository.findOne({ id: id, token: token, order_id: undefined });
        if (reservation !== undefined) {
            dto.updateModel(reservation);
            let savedReservation = await this.reservationRepository.save(reservation);
            let augmentedReservation = await this.augmentReservation(savedReservation);
            return augmentedReservation;
        } else {
            return undefined;
        }
    }

    async addToOrder(id: number, token: string, dto: AddToOrderReservationDto): Promise<AugmentedReservation> {
        let reservation = await this.reservationRepository.findOne({ id: id, token: token, order_id: undefined });
        if (reservation !== undefined) {
            dto.updateModel(reservation);
            let savedReservation = await this.reservationRepository.save(reservation);
            let augmentedReservation = await this.augmentReservation(savedReservation);
            return augmentedReservation;
        } else {
            return undefined;
        }
    }

    async delete(id: number): Promise<void> {
        return await this.reservationRepository.delete({ id: id });
    }

    private async augmentReservation(reservation: Reservation) {
        let event = await this.eventRepository.findOneById(reservation.event_id);
        let seat = await this.seatRepository.findOneById(reservation.seat_id);
        let category = await this.categoryRepository.findOneById(reservation.category_id);
        let price = reservation.is_reduced ? category.price_reduced : category.price;
        return new AugmentedReservation(reservation.id, reservation.unique_id, event, seat, category, reservation.is_reduced, price, reservation.order_id);
    }
}