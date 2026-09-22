import { Sequelize } from "sequelize-typescript";
import ClientModel from "./client.model";
import ProductModel from "./product.model";
import OrderModel from "./order.model";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import OrderRepository from "./order.repository";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";

describe("PlaceOrderRepository test", () => {
    let sequelize: Sequelize;
            
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
    
        await sequelize.addModels([ClientModel, ProductModel, OrderModel]);
        await sequelize.sync();
    });
    
    afterEach(async () => {
        await sequelize.close();
    });

    it("should add an order", async () => {
        const client = new Client({
            id: new Id("1c"),
            name: "Client 1",
            email: "client@teste.com",
            address: "Adress Test",
        });
        await ClientModel.create({
            id: "1c",
            name: "Client 1",
            email: "client@teste.com",
            address: "Adress Test",
        });
        const product1 = new Product({
            id: new Id("1p"),
            name: "Product 1",
            description: "Product Descript 1",
            salesPrice: 40,
        });
        const product2 = new Product({
            id: new Id("2p"),
            name: "Product 2",
            description: "Product Descript 2",
            salesPrice: 30,
        });

        const orderProps ={
            id: new Id("1"),
            client: client,
            products: [product1, product2],
        }
        const order = new Order(orderProps);

        const orderRepository = new OrderRepository();
        await orderRepository.addOrder(order);

        const result = await OrderModel.findOne({
            where: {id: "1"},
            include: ["client", "products"],
        });
        expect(result.id).toEqual(orderProps.id.id);
        expect(result.client.id).toEqual(orderProps.client.id.id);
        expect(result.client.name).toEqual(orderProps.client.name);
        expect(result.client.email).toEqual(orderProps.client.email);
        expect(result.client.address).toEqual(orderProps.client.address);
        expect(result.products).toEqual(
            expect.arrayContaining(
                orderProps.products.map((product) =>
                    expect.objectContaining({
                        product_id: product.id.id,
                        name: product.name,
                        description: product.description,
                        salesPrice: product.salesPrice,
                    })
                )
            )
        );
        expect(result.status).toEqual("pending");
    });

    it("should find an order", async () => {
        const clientProps = {
            id: "1c",
            name: "Client 1",
            email: "client@teste.com",
            address: "Adress Test",
        }
        await ClientModel.create(clientProps);

        const orderProps = {
            id: "1o",
            client_id: "1c",
            products: [{
                id: "1op",
                product_id: "1p",
                name: "Product 1",
                description: "Product Descript 1",
                salesPrice: 40,
            }],
            status: "approved",
        }
        await OrderModel.create(
            orderProps, {
            include: [{ model: ProductModel, as: "products"}]
        });

        const orderRepository = new OrderRepository();
        
        const order = await orderRepository.findOrder("1o");
        expect(order.id.id).toEqual(orderProps.id);
        expect(order.client.id.id).toEqual(clientProps.id);
        expect(order.products.length).toEqual(1);
        expect(order.products[0].id.id).toEqual(orderProps.products[0].product_id);
        expect(order.status).toEqual("approved");
    });
});
