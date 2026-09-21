import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice-.usecase";
import InvoiceFacade from "./invoice.facade";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceFacadeFactory from "../factory/facade.factory";

describe("InvoiceFacade test", () => {
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
    // const invoiceRepository = new InvoiceRepository();
    // const generateUseCase = new GenerateInvoiceUseCase(invoiceRepository);
    // const invoiceFacade = new InvoiceFacade({
    //     generateUseCase: generateUseCase,
    //     findUseCase: undefined,
    // });

    const invoiceFacade = InvoiceFacadeFactory.create();

    const input = {
      name: "Invoice Test",
      document: "Document Test",
      street: "Street Test",
      number: "1",
      complement: "",
      city: "City Test",
      state: "State Test",
      zipCode: "ZipCode Test",
      items: [{
          id: "1",
          name: "Invoice Item Test",
          price: 100,
      }],
    };

    const invoiceCreated = await invoiceFacade.generate(input);

    expect(invoiceCreated.id).toBeDefined;
    expect(invoiceCreated.name).toEqual(input.name);
    expect(invoiceCreated.document).toEqual(input.document);
    expect(invoiceCreated.street).toEqual("Street Test");
    expect(invoiceCreated.number).toEqual("1");
    expect(invoiceCreated.complement).toEqual( "");
    expect(invoiceCreated.city).toEqual("City Test");
    expect(invoiceCreated.state).toEqual("State Test");
    expect(invoiceCreated.zipCode).toEqual("ZipCode Test");
    expect(invoiceCreated.items).toEqual([
        {
            id: input.items[0].id,
            name: input.items[0].name,
            price: input.items[0].price,
        }
    ]);
    expect(invoiceCreated.total).toBe(100);
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

    // const invoiceRepository = new InvoiceRepository();
    // const findUseCase = new FindInvoiceUseCase(invoiceRepository);
    // const invoiceFacade = new InvoiceFacade({
    //     generateUseCase: undefined,
    //     findUseCase: findUseCase,
    // });

    const invoiceFacade = InvoiceFacadeFactory.create();

    const invoice = await invoiceFacade.find({id: "1"});
    expect(invoice.id).toEqual(invoiceProps.id);
    expect(invoice.name).toEqual(invoiceProps.name);
    expect(invoice.document).toEqual(invoiceProps.document);
    expect(invoice.address).toEqual({
        street: invoiceProps.street,
        number: invoiceProps.number,
        complement: invoiceProps.complement,
        city: invoiceProps.city,
        state: invoiceProps.state,
        zipCode: invoiceProps.zipCode,
    });
    expect(invoice.items).toEqual([
        {
            id: invoiceProps.items[0].id,
            name: invoiceProps.items[0].name,
            price: invoiceProps.items[0].price,
        }
    ]);
    expect(invoice.total).toBe(100);
    expect(invoice.createdAt).toBeDefined();
  });
});
