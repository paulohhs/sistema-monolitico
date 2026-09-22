import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderModel from "./order.model";
import ProductModel from "./product.model";

export default class OrderRepository implements CheckoutGateway {
    async addOrder(order: Order): Promise<void> {
        await OrderModel.create({
            id: order.id.id,
            client_id: order.client.id.id,
            products: order.products.map((product) => ({
                id: new Id().id,
                product_id: product.id.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
            })),
            status: order.status,
        }, {
            include: [{ model: ProductModel, as: "products"}]
        });
    }

    async findOrder(id: string): Promise<Order | null> {
        const order = await OrderModel.findOne({ 
            where: { id: id},
            include: ["client", "products"],
        });

        if (!order) {
            throw new Error("Order not found");
        }

        const client = new Client({
            id: new Id(order.client.id),
            name: order.client.name,
            email: order.client.email,
            address: order.client.address,
        });

        const products = order.products.map((product) => new Product({
            id: new Id(product.product_id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice,
        }));

        const orderProps = {
            id: new Id(order.id),
            client: client,
            products: products,
            status: order.status,
        }

        return new Order(orderProps);
    }
}
