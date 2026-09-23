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

    it("should create a client", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                name: "Client Test",
                email: "client@test.com",
                document: "123-456",
                address: {
                    street: "Street Test",
                    number: "1",
                    complement: "",
                    city: "City Test",
                    state: "State Test",
                    zipCode: "0000-000",
                }
            });

        expect(response.status).toBe(201);
        
        const body = response.body;
        expect(body.name).toBe("Client Test");
        expect(body.email).toBe("client@test.com");
        expect(body.document).toBe("123-456");
        expect(body.address.street).toBe("Street Test");
        expect(body.address.number).toBe("1");
        expect(body.address.complement).toBe("");
        expect(body.address.city).toBe("City Test");
        expect(body.address.state).toBe("State Test");
        expect(body.address.zipCode).toBe("0000-000");
        expect(body.createdAt).toBeDefined();
        expect(body.updatedAt).toBeDefined();
    });

    it("should not create a client", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                email: "client@test.com",
                document: "123-456",
                address: {
                    street: "Street Test",
                    number: "1",
                    complement: "",
                    city: "City Test",
                    state: "State Test",
                    zipCode: "0000-000",
                }
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toEqual("Name is required")
    });
});
