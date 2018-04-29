import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { AugmentedReservation } from './reservation.entity';

describe('ReservationsController', () => {
    let reservationsService: ReservationsService;
    let reservationsController: ReservationsController;

    beforeEach(() => {
        reservationsService = new ReservationsService(null, null, null, null, null);
        reservationsController = new ReservationsController(reservationsService);
    });

    it('Fetches all reservations from reservations service', async () => {
        let reservationMock = new AugmentedReservation(1, 'unique', null, null, null, false, 0, 2);
        let reservationsServiceFindMineSpy = spyOn(reservationsService, 'findMyReservations').and.returnValue([ reservationMock ]);
        let reservations = reservationsController.findMine({ token: 'token' });
        expect(reservationsServiceFindMineSpy).toHaveBeenCalledWith('token');
        expect(await reservations).toEqual([ reservationMock ]);
    });

    it('Creates a reservation for the given seat/event/category', async () => {
        let reservationMock = new AugmentedReservation(1, 'unique', null, null, null, false, 0, 2);
        let reservationsServiceCreateSpy = spyOn(reservationsService, 'create').and.returnValue(reservationMock);
        let reservation = reservationsController.create({ event_id: 1, seat_id: 2, category_id: 3 }, { token: 'token' });
        expect(reservationsServiceCreateSpy).toHaveBeenCalledWith(1, 2, 3, 'token');
        expect(await reservation).toEqual(reservationMock);
    });

    it('Throws HttpException when reservation cannot be created', async () => {
        let reservationsServiceCreateSpy = spyOn(reservationsService, 'create').and.throwError('error');
        let rejected: boolean;
        await reservationsController.create({ event_id: 1, seat_id: 2, category_id: 3 }, { token: 'token' }).catch(_ => rejected = true);
        expect(rejected).toEqual(true, 'Promise has to be rejected when no eventblock can be found.');
        expect(reservationsServiceCreateSpy).toHaveBeenCalledWith(1, 2, 3, 'token');
    });

    it('Updates the reservation with the given id', async () => {
        let reservationMock = new AugmentedReservation(1, 'unique', null, null, null, false, 0, 2);
        let reservationsServiceUpdateReductionSpy = spyOn(reservationsService, 'updateReduction').and.returnValue(reservationMock);
        let reservation = reservationsController.updateReduction({ id: 1 }, { is_reduced: true }, { token: 'token' });
        expect(reservationsServiceUpdateReductionSpy).toHaveBeenCalledWith(1, 'token', { is_reduced: true });
        expect(await reservation).toEqual(reservationMock);
    });

    it('Deletes a reservation using reservations service', () => {
        let reservationsServiceDeleteSpy = spyOn(reservationsService, 'delete');
        reservationsController.delete({ id: 1 });
        expect(reservationsServiceDeleteSpy).toHaveBeenCalledTimes(1);
    });
});