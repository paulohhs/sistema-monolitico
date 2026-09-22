import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import OrderRepository from "../repository/order.repository";
import ClientAdmFacadeFactory from "../../client-adm/factory/facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/facade.factory";
import PaymentFacedeFactory from "../../payment/factory/payment.facade.factory";
import OrderFacade from "./order.facade";
import { PlaceOrderInputDto } from "../usecase/place-order/place-order.dto";
import Address from "../../@shared/domain/value-object/address";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import { migrator } from "../../../migrations/config/migrator";
import { ClientModel } from "../../client-adm/repository/client.model";
import { ProductModel } from "../../product-adm/repository/product.model";
import { ProductModel as StoreCatalogProductModel } from "../../store-catalog/repository/product.model";
import CheckoutClientModel from "../repository/client.model";
import CheckoutProductModel from "../repository/product.model";
import OrderModel from "../repository/order.model";
import TransactionModel from "../../payment/repository/transaction.model";
import OrderFacadeFactory from "../factory/facade.factory";

describe("OrderFacade test", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
    });

    await sequelize.addModels([
      ClientModel,
      ProductModel,
      StoreCatalogProductModel,
      CheckoutClientModel,
      CheckoutProductModel,
      OrderModel,
      TransactionModel,
    ]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    await migration.down();
    await sequelize.close();
  });

  it("should place an order", async () => {
    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    // const catalogFacade = StoreCatalogFacadeFactory.create();
    // const invoiceFacade = InvoiceFacadeFactory.create();
    // const paymentFacade = PaymentFacedeFactory.create();
    // const orderRepository = new OrderRepository();
    // const placeOrderUseCase = new PlaceOrderUseCase(
    //   clientFacade,
    //   productFacade,
    //   catalogFacade,
    //   orderRepository,
    //   invoiceFacade,
    //   paymentFacade,
    // );
    // const orderFacade = new OrderFacade({
    //   addUseCase: placeOrderUseCase,
    // })

    const orderFacade = OrderFacadeFactory.create();

    clientFacade.add({
      id: "1c",
      name: "Client",
      email: "client@client.com",
      document: "123-456",
      address: new Address(
        "Street", 
        "1", 
        "", 
        "City", 
        "State", 
        "ZipCode"
      ),
    });
    productFacade.addProduct({
      id: "1",
      name: "Product",
      description: "Product Description",
      purchasePrice: 20,
      stock: 2,
    });
    const input: PlaceOrderInputDto = {
      clientId: "1c",
      products: [{productId: "1"}]
    };

    const salesPrice = 20 + (20 * 30 / 100);

    const order = await orderFacade.add(input);
    expect(order.invoiceId).toBeNull();
    expect(order.total).toBe(salesPrice);
    expect(order.products).toStrictEqual([
        {productId: "1"}
    ]);
  });
});
