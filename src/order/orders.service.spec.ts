import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrdersService } from './orders.service';
import { ReservationsService } from '../reservation/reservations.service';
import { AugmentedReservation, OrderKind } from '../reservation/reservation.entity';

describe('OrdersService', () => {
    let orderRepository: Repository<Order>;
    let reservationsService: ReservationsService;
    let ordersService: OrdersService;

    beforeEach(() => {
        orderRepository = new Repository<Order>();
        reservationsService = new ReservationsService(null, null, null, null, null);
        ordersService = new OrdersService(orderRepository, reservationsService);
    });

    it('Creates order and updates reservations', async () => {
        const order = new Order();
        order.id = 11;
        const orderRepositoryCreateSpy = spyOn(orderRepository, 'create').and.returnValue(order);
        const orderRepositorySaveSpy = spyOn(orderRepository, 'save').and.returnValue(order);
        const augmentedReservation = new AugmentedReservation(1, 'unique', null, null, null, true, 2, null, 3);
        const reservationServiceAddToOrderSpy = spyOn(reservationsService, 'addToOrder').and.returnValue(augmentedReservation);
        const orderDto = {
            unique_id: 'unique',
            title: 'm',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            locale: 'en',
            timestamp: 1000
        };
        const reservationDto = {
            order_id: order.id,
            order_kind: OrderKind.Reservation
        };

        const augmentedOrder = await ordersService.create(orderDto, 'token', [ augmentedReservation ]);

        expect(orderRepositoryCreateSpy).toHaveBeenCalledTimes(1);
        expect(orderRepositorySaveSpy).toHaveBeenCalledWith(order);
        expect(reservationServiceAddToOrderSpy).toHaveBeenCalledWith(augmentedReservation.id, 'token', reservationDto);
    });
});