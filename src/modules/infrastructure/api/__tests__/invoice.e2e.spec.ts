import { app, sequelize } from "../express";
import request from "supertest";
import InvoiceFacadeFactory from "../../../invoice/factory/facade.factory";
import { Umzug } from "umzug";
import { migrator } from "../../../../migrations/config/migrator";

describe("E2E test for invoice", () => {
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

    it("should find an invoice", async () => {
        const invoiceFacade = InvoiceFacadeFactory.create();
        
        const invoiceFacadeDto = {
            name: "Invoice Test",
            document: "1234-5678",
            street: "Street",
            number: "1",
            complement: "Complement",
            city: "City",
            state: "State",
            zipCode: "000000-000",
            items: [
                {
                    id: "1it",
                    name: "Item 1",
                    price: 50,
                    productId: "1p",
                },
                {
                    id: "2it",
                    name: "Item 2",
                    price: 50,
                    productId: "2p",
                }
            ],
            total: 100,
        }
        const invoice = await invoiceFacade.generate(invoiceFacadeDto);

        const response = await request(app).get(`/invoice/${invoice.id}`);

        expect(response.status).toBe(200);

        const body = response.body;
        expect(body.id).toEqual(invoice.id);
        expect(body.name).toEqual(invoiceFacadeDto.name);
        expect(body.document).toEqual(invoiceFacadeDto.document);
        expect(body.address).toEqual({
            street: invoiceFacadeDto.street,
            number: invoiceFacadeDto.number,
            complement: invoiceFacadeDto.complement,
            city: invoiceFacadeDto.city,
            state: invoiceFacadeDto.state,
            zipCode: invoiceFacadeDto.zipCode,
        });
        expect(body.items).toEqual(invoiceFacadeDto.items);
        expect(body.total).toEqual(invoiceFacadeDto.total);
    });

    it("should not find an invoice", async () => {
        const response = await request(app).get("/invoice/1i");

        expect(response.status).toBe(500);
        expect(response.body.error).toEqual("Invoice with id 1i not found");
    });
});
