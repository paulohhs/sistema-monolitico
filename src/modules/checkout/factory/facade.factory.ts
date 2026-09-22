import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import OrderRepository from "../repository/order.repository";
import ClientAdmFacadeFactory from "../../client-adm/factory/facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/facade.factory";
import PaymentFacedeFactory from "../../payment/factory/payment.facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import OrderFacade from "../facade/order.facade";

export default class OrderFacadeFactory {
    static create() {
        const clientFacade = ClientAdmFacadeFactory.create();
        const productFacade = ProductAdmFacadeFactory.create();
        const catalogFacade = StoreCatalogFacadeFactory.create();
        const invoiceFacade = InvoiceFacadeFactory.create();
        const paymentFacade = PaymentFacedeFactory.create();
        const orderRepository = new OrderRepository();
        const placeOrderUseCase = new PlaceOrderUseCase(
            clientFacade,
            productFacade,
            catalogFacade,
            orderRepository,
            invoiceFacade,
            paymentFacade,
        );
        const orderFacade = new OrderFacade({
            addUseCase: placeOrderUseCase,
        })

        return orderFacade
    }
}
