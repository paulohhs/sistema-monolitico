import { Umzug } from "umzug";
import { ClientModel } from "../../../client-adm/repository/client.model";
import { ProductModel } from "../../../product-adm/repository/product.model";
import { app, sequelize } from "../express";
import request from "supertest";
import { migrator } from "../../../../migrations/config/migrator";

describe("E2E test for checkout", () => {
    let migration: Umzug<any>;

    beforeEach(async () => {
        migration = migrator(sequelize);
        await migration.up();
    });

    afterEach(async () => {
        await migration.down({ to: 0 as const});
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should place an order", async() => {
        await ClientModel.create({
            id: "1c",
            name: "Client 1",
            email: "client@teste.com",
            document: "1234-5678",
            street: "Street",
            number: "1",
            complement: "",
            city: "City",
            state: "State",
            zipcode: "000-00",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await ProductModel.create({
            id: "1p",
            name: "Product 1",
            description: "Product Descript 1",
            purchasePrice: 50,
            salesPrice: 65,
            stock: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await ProductModel.create({
            id: "2p",
            name: "Product 2",
            description: "Product Descript 2",
            purchasePrice: 50,
            salesPrice: 65,
            stock: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: "1c",
                products: ["1p", "2p"],
            })
        
        expect(response.status).toBe(201);

        const body = response.body;
        expect(body.id).toBeDefined();
        expect(body.invoiceId).toBeDefined();
        expect(body.status).toEqual("approved");
        expect(body.total).toEqual(130);
        expect(body.products.length).toBe(2);
        expect(body.products).toEqual([
            {productId: "1p"}, {productId: "2p"}
        ]);
    });

    it("should not place an order", async() => {
        await ClientModel.create({
            id: "1c",
            name: "Client 1",
            email: "client@teste.com",
            document: "1234-5678",
            street: "Street",
            number: "1",
            complement: "",
            city: "City",
            state: "State",
            zipcode: "000-00",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const response = await request(app)
            .post("/checkout")
            .send({
                clientId: "1c",
                products: ["1p"],
            })
        
        expect(response.status).toBe(500);
        expect(response.body.error).toEqual("Product with id 1p not found");
    });
});
