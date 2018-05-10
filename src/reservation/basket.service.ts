import { Component, Delete } from "@nestjs/common";
import { UuidFactory } from "../utils/uuid.factory";
import { Reservation, AugmentedReservation } from "../reservation/reservation.entity";
import { ReservationsService } from "../reservation/reservations.service";
import { DeleteResult } from "typeorm";
import { TokenTimeService } from "./token-time.service";

@Component()
export class BasketService {
    private token: string;
    private basketContainer: BasketContainer;

    constructor(private readonly uuidFactory: UuidFactory, private readonly reservationsService: ReservationsService, private readonly tokenTimeService: TokenTimeService) { }

    async initializeAndReturnToken(token: string): Promise<string> {
        if (token !== undefined && token !== null) {
            this.token = token;
        } else {
            this.token = this.uuidFactory.create();
        }
        this.basketContainer = new BasketContainer(this.reservationsService, this.token, this.tokenTimeService);
        return this.token;
    }

    async getReservations(): Promise<AugmentedReservation[]> {
        let basket = await this.basketContainer.getBasket();
        if (basket !== undefined) {
            return basket.getReservations();
        } else {
            return [];
        }
    }

    async addReservation(event_id: number, seat_id: number, category_id: number): Promise<AugmentedReservation> {
        let basket = await this.basketContainer.getOrCreateBasket();
        return basket.addReservation(event_id, seat_id, category_id);
    }

    async removeReservation(id: number): Promise<DeleteResult> {
        let basket = await this.basketContainer.getBasket();
        if (basket !== undefined) {
            return basket.removeReservation(id);
        } else {
            return new Promise<DeleteResult>((resolve, reject) => resolve());
        }
    }

    async updateReduction(id: number, isReduced: boolean): Promise<AugmentedReservation> {
        let basket = await this.basketContainer.getBasket();
        if (basket !== undefined) {
            return await basket.updateReduction(id, isReduced);
        } else {
            return new Promise<AugmentedReservation>((resolve, reject) => reject("Reservation has timed out."));
        }
    }

    async getExpirationTimestampInSeconds(): Promise<number> {
        let basket = await this.basketContainer.getBasket();
        if (basket !== undefined) {
            return basket.isValidUntilInSeconds();
        } else {
            return 0;
        }
    }
}

class BasketContainer {
    private readonly reservationsService: ReservationsService;
    private readonly token: string;
    private readonly tokenTimeService: TokenTimeService;
    
    private basket: Basket = undefined;

    constructor(reservationsService: ReservationsService, token: string, tokenTimeService: TokenTimeService) {
        this.reservationsService = reservationsService;
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
        if (this.basket === undefined) {
            this.basket = await this.createBasketIfReservationsAvailable();
        }
        
        this.basket = this.purgeBasketIfInvalid(this.basket);

        if (this.basket === undefined) {
            this.basket = this.createEmptyBasket();
        }
        return this.basket;
    }

    private async createBasketIfReservationsAvailable(): Promise<Basket> {
        let reservations = await this.reservationsService.findMyReservations(this.token);
        if (reservations.length > 0) {
            let expirationDuration = this.tokenTimeService.getTokenExpirationDuration();
            let timestamp = reservations[0].timestamp;
            return new Basket(this.reservationsService, this.token, expirationDuration, timestamp, reservations);
        } else {
            return undefined;
        }
    }

    private createEmptyBasket(): Basket {
        let expirationDuration = this.tokenTimeService.getTokenExpirationDuration();
        let now = this.tokenTimeService.getNow();
        return new Basket(this.reservationsService, this.token, expirationDuration, now, []);
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
    private readonly token: string;
    private readonly timestamp: number;
    private readonly expirationTimestamp: number;
    
    private reservations: AugmentedReservation[];
    private isPurged: boolean = false;

    constructor(reservationsService: ReservationsService, token: string, tokenExpirationDuration: number, timestamp: number, reservations: AugmentedReservation[]) {
        this.reservationsService = reservationsService;
        this.timestamp = timestamp;
        this.token = token;
        this.expirationTimestamp = this.timestamp + tokenExpirationDuration;
        this.reservations = reservations;
    }

    getReservations(): AugmentedReservation[] {
        this.throwIfPurged();
        return this.reservations;
    }

    async addReservation(event_id: number, seat_id: number, category_id: number): Promise<AugmentedReservation> {
        this.throwIfPurged();
        let reservation = await this.reservationsService.create(event_id, seat_id, category_id, this.token, this.timestamp);
        this.reservations.push(reservation);
        return reservation;
    }

    async removeReservation(id: number): Promise<DeleteResult> {
        this.throwIfPurged();
        let deleteResult = await this.reservationsService.delete(id);
        this.reservations = this.reservations.filter(r => r.id != id);
        return deleteResult;
    }

    async updateReduction(id: number, isReduced: boolean): Promise<AugmentedReservation> {
        this.throwIfPurged();
        let reservation = await this.reservationsService.updateReduction(id, this.token, { is_reduced: isReduced });
        this.reservations = this.reservations.filter(r => r.id != id).concat(reservation);
        return reservation;
    }

    isValid(): boolean {
        this.throwIfPurged();
        return this.expirationTimestamp >= Math.round(Date.now() / 1000);
    }

    isValidUntilInSeconds(): number {
        this.throwIfPurged();
        return this.expirationTimestamp;
    }

    async purge(): Promise<DeleteResult> {
        this.throwIfPurged();
        this.isPurged = true;
        return this.reservationsService.purgeReservations(this.token);
    }

    private throwIfPurged(): void {
        if (this.isPurged) {
            throw new Error("You cannot access a purged basket.");
        }
    }
}