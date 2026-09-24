import GenerateInvoiceUseCase from "./generate-invoice-.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("GenerateInvoice usecase unit test", () => {
  it("should generate an invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

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
          productId: "1p",
          name: "Invoice Item Test",
          price: 100,
      }],
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined;
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual("Street Test");
    expect(result.number).toEqual("1");
    expect(result.complement).toEqual( "");
    expect(result.city).toEqual("City Test");
    expect(result.state).toEqual("State Test");
    expect(result.zipCode).toEqual("ZipCode Test");
    expect(result.items).toEqual([
        {
            id: input.items[0].id,
            productId: input.items[0].productId,
            name: input.items[0].name,
            price: input.items[0].price,
        }
    ]);
    expect(result.total).toEqual(100);
  });
});
