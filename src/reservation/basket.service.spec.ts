import { BasketService } from './basket.service';
import { UuidFactory } from '../utils/uuid.factory';
import { ReservationsService } from './reservations.service';
import { TokenTimeService } from '../utils/token-time.service';
import { AugmentedReservation } from './reservation.entity';
import { OrdersService } from '../order/orders.service';

describe('BasketService', () => {
    let uuidFactory: UuidFactory;
    let reservationsService: ReservationsService;
    let ordersService: OrdersService;
    let tokenTimeService: TokenTimeService;
    let basketService: BasketService;

    let now: number;
    let afterPast: number;
    let past: number;
    let beforePast: number;
    let expirationDuration: number;
    let augmentedReservation: AugmentedReservation;
    let repositoryReservations: AugmentedReservation[];
    let givenToken: string;

    let tokenTimeServiceGetPurgeTimestampSpy: jasmine.Spy;
    let reservationsServicePurgeReservationsByTimestampSpy: jasmine.Spy;
    let reservationsServicePurgeReservationsByTokenSpy: jasmine.Spy;
    let reservationsServiceFindMyReservationsSpy: jasmine.Spy;
    let tokenTimeServiceGetNowSpy: jasmine.Spy;
    let tokenTimeServiceGetTokenExpirationDurationSpy: jasmine.Spy;

    beforeEach(async () => {
        uuidFactory = new UuidFactory();
        reservationsService = new ReservationsService(null, null, null, null, null);
        ordersService = new OrdersService(null, null);
        tokenTimeService = new TokenTimeService();
        basketService = new BasketService(uuidFactory, reservationsService, ordersService, tokenTimeService);

        // 850            900             950                1000              1100
        // -----------------------------------------------------------------------------> time
        // ^              ^               ^                  ^                 ^
        // beforePast     past            afterPast          now               future
        //
        //                |-----------------------------------------|
        //                              expiration duration = 140

        now = 1000;
        afterPast = now - 50;
        past = now - 100;
        beforePast = now - 150;
        expirationDuration = 140;

        augmentedReservation = new AugmentedReservation(1, 'unique', null, null, null, false, 0, null, afterPast);
        repositoryReservations = [ augmentedReservation ];
        givenToken = 'token';
        tokenTimeServiceGetPurgeTimestampSpy = spyOn(tokenTimeService, 'getPurgeTimestamp');
        reservationsServicePurgeReservationsByTimestampSpy = spyOn(reservationsService, 'purgeReservationsByTimestamp');
        reservationsServicePurgeReservationsByTokenSpy = spyOn(reservationsService, 'purgeReservationsByToken');
        reservationsServiceFindMyReservationsSpy = spyOn(reservationsService, 'findMyReservations');
        tokenTimeServiceGetNowSpy = spyOn(tokenTimeService, 'getNow').and.returnValue(now);
        tokenTimeServiceGetTokenExpirationDurationSpy = spyOn(tokenTimeService, 'getTokenExpirationDuration');
        await basketService.initializeAndReturnToken(givenToken);
    });

    it('Initializes with the given token and returns it', async () => {
        const uuidFactoryCreateSpy = spyOn(uuidFactory, 'create');

        const token = await basketService.initializeAndReturnToken('given');

        expect(uuidFactoryCreateSpy).not.toHaveBeenCalled();
        expect(token).toEqual('given');
    });

    it('Initializes without token, generates a new one and returns it', async () => {
        const uuidFactoryCreateSpy = spyOn(uuidFactory, 'create').and.returnValue('generated');

        const token = await basketService.initializeAndReturnToken(undefined);

        expect(uuidFactoryCreateSpy).toHaveBeenCalledTimes(1);
        expect(token).toEqual('generated');
    });

    it('Returns existing reservations', async () => {
        tokenTimeServiceGetPurgeTimestampSpy.and.returnValue(past);
        reservationsServiceFindMyReservationsSpy.and.returnValue(repositoryReservations);
        tokenTimeServiceGetTokenExpirationDurationSpy.and.returnValue(expirationDuration);

        const reservations = await basketService.getReservations();

        expect(tokenTimeServiceGetPurgeTimestampSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServicePurgeReservationsByTimestampSpy).toHaveBeenCalledWith(past);
        expect(reservationsServiceFindMyReservationsSpy).toHaveBeenCalledWith(givenToken);
        expect(tokenTimeServiceGetNowSpy).toHaveBeenCalledTimes(1);
        expect(tokenTimeServiceGetTokenExpirationDurationSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServicePurgeReservationsByTokenSpy).toHaveBeenCalledTimes(0);
        expect(reservations).toEqual(repositoryReservations);
    });

    it('Does not return expired reservations', async () => {
        repositoryReservations[0].timestamp = beforePast;

        tokenTimeServiceGetPurgeTimestampSpy.and.returnValue(past);
        reservationsServiceFindMyReservationsSpy.and.returnValue(repositoryReservations);
        tokenTimeServiceGetTokenExpirationDurationSpy.and.returnValue(expirationDuration);

        const reservations = await basketService.getReservations();

        expect(tokenTimeServiceGetPurgeTimestampSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServicePurgeReservationsByTimestampSpy).toHaveBeenCalledWith(past);
        expect(reservationsServiceFindMyReservationsSpy).toHaveBeenCalledWith(givenToken);
        expect(tokenTimeServiceGetNowSpy).toHaveBeenCalledTimes(1);
        expect(tokenTimeServiceGetTokenExpirationDurationSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServicePurgeReservationsByTokenSpy).toHaveBeenCalledWith(givenToken);
        expect(reservations).toEqual([]);
    });

    it('Adds a reservation with the current timestamp if it is the first reservation', async () => {
        tokenTimeServiceGetPurgeTimestampSpy.and.returnValue(past);
        reservationsServiceFindMyReservationsSpy.and.returnValue([]);
        tokenTimeServiceGetTokenExpirationDurationSpy.and.returnValue(expirationDuration);
        const reservationsServiceCreateSpy = spyOn(reservationsService, 'create').and.returnValue(augmentedReservation);

        const reservation = await basketService.addReservation(11, 22, 33);

        expect(tokenTimeServiceGetPurgeTimestampSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServicePurgeReservationsByTimestampSpy).toHaveBeenCalledWith(past);
        expect(reservationsServiceFindMyReservationsSpy).toHaveBeenCalledWith(givenToken);
        expect(tokenTimeServiceGetNowSpy).toHaveBeenCalledTimes(1);
        expect(tokenTimeServiceGetTokenExpirationDurationSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServiceCreateSpy).toHaveBeenCalledWith(11, 22, 33, givenToken, now);
        expect(reservation).toEqual(augmentedReservation);
    });

    it('Adds a reservation with the basket timestamp if it is not the first reservation', async () => {
        tokenTimeServiceGetPurgeTimestampSpy.and.returnValue(past);
        reservationsServiceFindMyReservationsSpy.and.returnValue(repositoryReservations);
        tokenTimeServiceGetTokenExpirationDurationSpy.and.returnValue(expirationDuration);
        const reservationsServiceCreateSpy = spyOn(reservationsService, 'create').and.returnValue(augmentedReservation);

        const reservation = await basketService.addReservation(11, 22, 33);

        expect(tokenTimeServiceGetPurgeTimestampSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServicePurgeReservationsByTimestampSpy).toHaveBeenCalledWith(past);
        expect(reservationsServiceFindMyReservationsSpy).toHaveBeenCalledWith(givenToken);
        expect(tokenTimeServiceGetNowSpy).toHaveBeenCalledTimes(1);
        expect(tokenTimeServiceGetTokenExpirationDurationSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServiceCreateSpy).toHaveBeenCalledWith(11, 22, 33, givenToken, afterPast);
        expect(reservation).toEqual(augmentedReservation);
    });

    it('Removes a reservation', async () => {
        tokenTimeServiceGetPurgeTimestampSpy.and.returnValue(past);
        reservationsServiceFindMyReservationsSpy.and.returnValue(repositoryReservations);
        tokenTimeServiceGetTokenExpirationDurationSpy.and.returnValue(expirationDuration);
        const reservationsServiceDeleteSpy = spyOn(reservationsService, 'delete');

        await basketService.removeReservation(augmentedReservation.id);

        expect(tokenTimeServiceGetPurgeTimestampSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServicePurgeReservationsByTimestampSpy).toHaveBeenCalledWith(past);
        expect(reservationsServiceFindMyReservationsSpy).toHaveBeenCalledWith(givenToken);
        expect(tokenTimeServiceGetNowSpy).toHaveBeenCalledTimes(1);
        expect(tokenTimeServiceGetTokenExpirationDurationSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServiceDeleteSpy).toHaveBeenCalledWith(augmentedReservation.id);
    });

    it('Does nothing if no reservations in basket', async () => {
        tokenTimeServiceGetPurgeTimestampSpy.and.returnValue(past);
        reservationsServiceFindMyReservationsSpy.and.returnValue([]);
        tokenTimeServiceGetTokenExpirationDurationSpy.and.returnValue(expirationDuration);
        const reservationsServiceDeleteSpy = spyOn(reservationsService, 'delete');

        await basketService.removeReservation(augmentedReservation.id);

        expect(tokenTimeServiceGetPurgeTimestampSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServicePurgeReservationsByTimestampSpy).toHaveBeenCalledWith(past);
        expect(reservationsServiceFindMyReservationsSpy).toHaveBeenCalledWith(givenToken);
        expect(tokenTimeServiceGetNowSpy).not.toHaveBeenCalled();
        expect(tokenTimeServiceGetTokenExpirationDurationSpy).not.toHaveBeenCalled();
        expect(reservationsServiceDeleteSpy).not.toHaveBeenCalled();
    });

    it('Updates a reservation', async () => {
        tokenTimeServiceGetPurgeTimestampSpy.and.returnValue(past);
        reservationsServiceFindMyReservationsSpy.and.returnValue(repositoryReservations);
        tokenTimeServiceGetTokenExpirationDurationSpy.and.returnValue(expirationDuration);
        const reservationsServiceUpdateReductionSpy = spyOn(reservationsService, 'updateReduction');

        await basketService.updateReduction(augmentedReservation.id, true);

        expect(tokenTimeServiceGetPurgeTimestampSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServicePurgeReservationsByTimestampSpy).toHaveBeenCalledWith(past);
        expect(reservationsServiceFindMyReservationsSpy).toHaveBeenCalledWith(givenToken);
        expect(tokenTimeServiceGetNowSpy).toHaveBeenCalledTimes(1);
        expect(tokenTimeServiceGetTokenExpirationDurationSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServiceUpdateReductionSpy).toHaveBeenCalledWith(augmentedReservation.id, givenToken, { is_reduced: true });
    });

    it('Rejects if no reservations in basket', async () => {
        tokenTimeServiceGetPurgeTimestampSpy.and.returnValue(past);
        reservationsServiceFindMyReservationsSpy.and.returnValue([]);
        tokenTimeServiceGetTokenExpirationDurationSpy.and.returnValue(expirationDuration);
        const reservationsServiceUpdateReductionSpy = spyOn(reservationsService, 'updateReduction');

        let rejected: boolean;
        await basketService.updateReduction(augmentedReservation.id, true).catch(_ => rejected = true);
        expect(rejected).toEqual(true, 'Promise has to be rejected when no reservations are in basket.');

        expect(tokenTimeServiceGetPurgeTimestampSpy).toHaveBeenCalledTimes(1);
        expect(reservationsServicePurgeReservationsByTimestampSpy).toHaveBeenCalledWith(past);
        expect(reservationsServiceFindMyReservationsSpy).toHaveBeenCalledWith(givenToken);
        expect(tokenTimeServiceGetNowSpy).not.toHaveBeenCalled();
        expect(tokenTimeServiceGetTokenExpirationDurationSpy).not.toHaveBeenCalled();
        expect(reservationsServiceUpdateReductionSpy).not.toHaveBeenCalled();
    });

    it('Returns the expiration timestamp when basket is not empty', async () => {
        reservationsServiceFindMyReservationsSpy.and.returnValue(repositoryReservations);
        tokenTimeServiceGetTokenExpirationDurationSpy.and.returnValue(expirationDuration);

        const expirationTimestamp = await basketService.getExpirationTimestamp();

        expect(expirationTimestamp).toEqual(afterPast + expirationDuration);
    });

    it('Returns 0 when basket is empty', async () => {
        reservationsServiceFindMyReservationsSpy.and.returnValue([]);
        tokenTimeServiceGetTokenExpirationDurationSpy.and.returnValue(expirationDuration);

        const expirationTimestamp = await basketService.getExpirationTimestamp();

        expect(expirationTimestamp).toEqual(0);
    });
});