import { Umzug } from "umzug";
import { app, sequelize } from "../express";
import request from "supertest";
import { migrator } from "../../../../migrations/config/migrator";

describe("E2e test for client", () => {
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

    it("should create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "Product Test",
                description: "Product Description",
                purchasePrice: 100,
                stock: 2,
            });

        expect(response.status).toBe(201);
        
        const body = response.body;
        expect(body.id).toBeDefined();
        expect(body.name).toBe("Product Test");
        expect(body.description).toBe("Product Description");
        expect(body.purchasePrice).toBe(100);
        expect(body.stock).toBe(2);
        expect(body.salesPrice).toBe(130);
    });

    it("should not create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "Product Test",
                description: "Product Description",
                purchasePrice: -10,
                stock: 2,
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toEqual("The purchase price must be greather or equal zero")
    });
});
