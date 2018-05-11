import { Component } from '@nestjs/common';
import { UuidFactory } from '../utils/uuid.factory';
import { Reservation, AugmentedReservation, OrderKind } from '../reservation/reservation.entity';
import { ReservationsService } from '../reservation/reservations.service';
import { OrdersService } from '../order/orders.service';
import { DeleteResult } from 'typeorm';
import { TokenTimeService } from '../utils/token-time.service';
import { OrderDto, Order, AugmentedOrder } from '../order/order.entity';

@Component()
export class BasketService {
    private token: string;
    private basketContainer: BasketContainer;

    constructor(
        private readonly uuidFactory: UuidFactory,
        private readonly reservationsService: ReservationsService,
        private readonly ordersService: OrdersService,
        private readonly tokenTimeService: TokenTimeService) { }

    initializeAndReturnToken(token: string): string {
        if (token !== undefined && token !== null) {
            this.token = token;
        } else {
            this.token = this.uuidFactory.create();
        }
        this.basketContainer = new BasketContainer(this.reservationsService, this.ordersService, this.token, this.tokenTimeService);
        return this.token;
    }

    async getReservations(): Promise<AugmentedReservation[]> {
        const basket = await this.basketContainer.getBasket();
        if (basket !== undefined) {
            return basket.getReservations();
        } else {
            return [];
        }
    }

    async addReservation(event_id: number, seat_id: number, category_id: number): Promise<AugmentedReservation> {
        const basket = await this.basketContainer.getOrCreateBasket();
        return basket.addReservation(event_id, seat_id, category_id);
    }

    async removeReservation(id: number): Promise<DeleteResult> {
        const basket = await this.basketContainer.getBasket();
        if (basket !== undefined) {
            return basket.removeReservation(id);
        } else {
            return new Promise<DeleteResult>((resolve, reject) => resolve());
        }
    }

    async updateReduction(id: number, isReduced: boolean): Promise<AugmentedReservation> {
        const basket = await this.basketContainer.getBasket();
        if (basket !== undefined) {
            return await basket.updateReduction(id, isReduced);
        } else {
            return new Promise<AugmentedReservation>((resolve, reject) => reject('Reservation has timed out.'));
        }
    }

    async getExpirationTimestamp(): Promise<number> {
        const basket = await this.basketContainer.getBasket();
        if (basket !== undefined) {
            return basket.getExpirationTimestamp();
        } else {
            return 0;
        }
    }
}

class BasketContainer {
    private readonly reservationsService: ReservationsService;
    private readonly ordersService: OrdersService;
    private readonly token: string;
    private readonly tokenTimeService: TokenTimeService;

    private basket: Basket = undefined;

    constructor(reservationsService: ReservationsService, ordersService: OrdersService, token: string, tokenTimeService: TokenTimeService) {
        this.reservationsService = reservationsService;
        this.ordersService = ordersService;
        this.token = token;
        this.tokenTimeService = tokenTimeService;
    }

    async getBasket(): Promise<Basket> {
        if (this.basket === undefined) {
            this.basket = await this.createBasketIfReservationsAvailable();
        }

        this.basket = this.purgeBasketIfInvalid(this.basket);

        return this.basket;
    }

    async getOrCreateBasket(): Promise<Basket> {
        this.basket = await this.getBasket();

        if (this.basket === undefined) {
            this.basket = this.createEmptyBasket();
        }
        return this.basket;
    }

    private async createBasketIfReservationsAvailable(): Promise<Basket> {
        const purgeTimestamp = this.tokenTimeService.getPurgeTimestamp();
        await this.reservationsService.purgeReservationsByTimestamp(purgeTimestamp);
        const reservations = await this.reservationsService.findMyReservations(this.token);
        if (reservations.length > 0) {
            const timestamp = reservations[0].timestamp;
            return new Basket(this.reservationsService, this.ordersService, this.token, this.tokenTimeService, timestamp, reservations);
        } else {
            return undefined;
        }
    }

    private createEmptyBasket(): Basket {
        const now = this.tokenTimeService.getNow();
        return new Basket(this.reservationsService, this.ordersService, this.token, this.tokenTimeService, now, []);
    }

    private purgeBasketIfInvalid(basket: Basket): Basket {
        if (basket !== undefined && !basket.isValid()) {
            basket.purge();
            basket = undefined;
        }
        return basket;
    }
}

class Basket {
    private readonly reservationsService: ReservationsService;
    private readonly ordersService: OrdersService;
    private readonly token: string;
    private readonly tokenTimeService: TokenTimeService;
    private readonly timestamp: number;
    private readonly expirationTimestamp: number;

    private reservations: AugmentedReservation[];
    private isPurged: boolean = false;

    constructor(reservationsService: ReservationsService, ordersService: OrdersService, token: string, tokenTimeService: TokenTimeService, timestamp: number, reservations: AugmentedReservation[]) {
        this.reservationsService = reservationsService;
        this.ordersService = ordersService;
        this.token = token;
        this.tokenTimeService = tokenTimeService;
        this.timestamp = timestamp;
        this.expirationTimestamp = this.timestamp + tokenTimeService.getTokenExpirationDuration();
        this.reservations = reservations;
    }

    getReservations(): AugmentedReservation[] {
        this.throwIfPurged();
        return this.reservations;
    }

    async addReservation(event_id: number, seat_id: number, category_id: number): Promise<AugmentedReservation> {
        this.throwIfPurged();
        const reservation = await this.reservationsService.create(event_id, seat_id, category_id, this.token, this.timestamp);
        this.reservations.push(reservation);
        return reservation;
    }

    async removeReservation(id: number): Promise<DeleteResult> {
        this.throwIfPurged();
        const deleteResult = await this.reservationsService.delete(id);
        this.reservations = this.reservations.filter(r => r.id !== id);
        return deleteResult;
    }

    async updateReduction(id: number, isReduced: boolean): Promise<AugmentedReservation> {
        this.throwIfPurged();
        const reservation = await this.reservationsService.updateReduction(id, this.token, { is_reduced: isReduced });
        this.reservations = this.reservations.filter(r => r.id !== id).concat(reservation);
        return reservation;
    }

    async createOrder(orderDto: OrderDto): Promise<AugmentedOrder> {
        this.throwIfPurged();
        const augmentedOrder = await this.ordersService.create(orderDto, this.token, this.reservations);
        return augmentedOrder;
    }

    isValid(): boolean {
        this.throwIfPurged();
        return this.expirationTimestamp >= this.tokenTimeService.getNow();
    }

    getExpirationTimestamp(): number {
        this.throwIfPurged();
        return this.expirationTimestamp;
    }

    async purge(): Promise<DeleteResult> {
        this.throwIfPurged();
        this.isPurged = true;
        return this.reservationsService.purgeReservationsByToken(this.token);
    }

    private throwIfPurged(): void {
        if (this.isPurged) {
            throw new Error('You cannot access a purged basket.');
        }
    }
}