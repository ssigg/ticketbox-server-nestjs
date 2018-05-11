import { Component } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Order, OrderDto, AugmentedOrder } from "./order.entity";
import { Repository } from "typeorm";
import { ReservationsService } from "../reservation/reservations.service";
import { OrderKind, AugmentedReservation } from "../reservation/reservation.entity";

@Component()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        private readonly reservationsService: ReservationsService
    ) { }

    async create(dto: OrderDto, token: string, reservations: AugmentedReservation[]): Promise<AugmentedOrder> {
        let order = await this.orderRepository.create();
        order.updateFromDto(dto);
        let savedOrder = await this.orderRepository.save(order);
        let addToOrderReservationDto = {
            order_id: order.id,
            order_kind: OrderKind.Reservation
        };
        let orderedReservations = await Promise.all(reservations.map(async r => await this.reservationsService.addToOrder(r.id, token, addToOrderReservationDto)));
        let augmentedOrder = new AugmentedOrder(savedOrder.id, savedOrder.unique_id, savedOrder.title, savedOrder.firstname, savedOrder.lastname, savedOrder.email, savedOrder.locale, savedOrder.timestamp, orderedReservations);
        return augmentedOrder;
    }
}