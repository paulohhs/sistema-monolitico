import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../../client-adm/repository/client.model";
import { clientsRoute } from "./routes/client.route";
import { productsRoute } from "./routes/product.route";
import { ProductModel } from "../../product-adm/repository/product.model";
import { checkoutRoute } from "./routes/checkout.route";
import { invoiceRoute } from "./routes/invoice.route";
import { ProductModel as StoreCatalogProductModel } from "../../store-catalog/repository/product.model";
import CheckoutClientModel from "../../checkout/repository/client.model";
import CheckoutProductModel from "../../checkout/repository/product.model";
import OrderModel from "../../checkout/repository/order.model";
import TransactionModel from "../../payment/repository/transaction.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemModel from "../../invoice/repository/invoice-item.model";

export const app: Express = express();
app.use(express.json());
app.use("/clients", clientsRoute);
app.use("/products", productsRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute)

export let sequelize: Sequelize;

async function setupDb() {
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
        InvoiceModel,
        InvoiceItemModel,
    ]);
}

setupDb();
