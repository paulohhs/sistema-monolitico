import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import Invoice from "../domain/invoice";
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-item";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceRepository from "./invoice.repository";

describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;
        
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
    
        await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
        await sequelize.sync();
    });
    
    afterEach(async () => {
        await sequelize.close();
    });

    it("should generate an invoice", async () => {
        const address = new Address(
            "Street Test",
            "1",
            "",
            "City Test",
            "State Test",
            "ZipCode Test",
        );
        const invoiceItem = new InvoiceItem({
            id: new Id("item-1"),
            name: "Item Test",
            price: 100,
        });
        const invoiceProps = {
            id: new Id("1"),
            name: "Invoice Test",
            document: "Document Test",
            address: address,
            items: [invoiceItem],
        }

        const invoice = new Invoice(invoiceProps);
        const invoiceRepository = new InvoiceRepository();
        await invoiceRepository.add(invoice);

        const invoiceDb = await InvoiceModel.findOne({
            where: { id: invoice.id.id },
            include: ["items"],
        });
        expect(invoiceDb.toJSON()).toStrictEqual({
            id: invoiceProps.id.id,
            name: invoiceProps.name,
            document: invoiceProps.document,
            street: invoiceProps.address.street,
            number: invoiceProps.address.number,
            complement: invoiceProps.address.complement,
            city: invoiceProps.address.city,
            state: invoiceProps.address.state,
            zipCode: invoiceProps.address.zipCode,
            items: [{
                id: invoiceItem.id.id,
                invoice_id: invoice.id.id,
                name: invoiceItem.name,
                price: invoiceItem.price,
            }]
        })
    });

    it("should find an invoice", async () => {
        const invoiceProps = {
            id: "1",
            name: "Invoice Test",
            document: "Document Test",
            street: "Street Test",
            number: "1",
            complement: "Complement Test",
            city: "City Test",
            state: "State Test",
            zipCode: "ZipCode Test",
            items: [{
                id: "item-1",
                name: "Item 1",
                price: 100,
            }],
        }
        await InvoiceModel.create(invoiceProps, {
            include: [{ model: InvoiceItemModel, as: "items" }]
        });

        const invoiceRepository = new InvoiceRepository();
        const invoiceDb = await invoiceRepository.find("1");

        expect(invoiceDb).toBeDefined();
        expect(invoiceDb.id.id).toEqual(invoiceProps.id);
        expect(invoiceDb.name).toEqual(invoiceProps.name);
        expect(invoiceDb.document).toEqual(invoiceProps.document);
        expect(invoiceDb.address.street).toEqual(invoiceProps.street);
        expect(invoiceDb.address.number).toEqual(invoiceProps.number);
        expect(invoiceDb.address.complement).toEqual(invoiceProps.complement);
        expect(invoiceDb.address.city).toEqual(invoiceProps.city);
        expect(invoiceDb.address.state).toEqual(invoiceProps.state);
        expect(invoiceDb.address.zipCode).toEqual(invoiceProps.zipCode);
        expect(invoiceDb.items[0].id.id).toEqual(invoiceProps.items[0].id);
        expect(invoiceDb.items[0].name).toEqual(invoiceProps.items[0].name);
        expect(invoiceDb.items[0].price).toEqual(invoiceProps.items[0].price);
    });

    it("should throw an error when not found an invoice", async () => {
        const invoiceRepository = new InvoiceRepository();
        await expect(invoiceRepository.find("1")).rejects.toThrow(
            "Invoice with id 1 not found"
        );
    });
});
