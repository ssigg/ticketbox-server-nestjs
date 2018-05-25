import { OrdersController } from './orders.controller';
import { BasketService } from '../reservation/basket.service';
import { AugmentedOrder } from './order.entity';

describe('OrdersController', () => {
    let basketService: BasketService;
    let ordersController: OrdersController;

    beforeEach(() => {
        basketService = new BasketService(null, null, null, null);
        ordersController = new OrdersController(basketService);
    });

    it('Creates an order', async () => {
        const augmentedOrderMock = new AugmentedOrder(1, 'unique', 'title', 'firstname', 'lastname', 'email', 'locale', 1000, []);
        const basketServiceCreateOrderSpy = spyOn(basketService, 'createOrder').and.returnValue(augmentedOrderMock);
        const body = {
            title: 'm',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            locale: 'en'
        };

        const augmentedOrder = await ordersController.create(body);

        expect(augmentedOrder).toEqual(augmentedOrderMock);
        expect(basketServiceCreateOrderSpy).toHaveBeenCalledWith(body);
    });

    it('Throws exception when no order can be created', async () => {
        const basketServiceCreateOrderSpy = spyOn(basketService, 'createOrder').and.throwError('error');
        const body = {
            title: 'm',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            locale: 'en'
        };

        let rejected: boolean;
        await ordersController.create(body).catch(_ => rejected = true);

        expect(rejected).toEqual(true, 'Promise has to be rejected when no eventblock can be found.');
        expect(basketServiceCreateOrderSpy).toHaveBeenCalledWith(body);
    });
});