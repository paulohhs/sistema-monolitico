import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import InvoiceItem from "../../domain/invoice-item";
import FindInvoiceUseCase from "./find-invoice.usecase";

const address = new Address(
    "Street Test",
    "1",
    "",
    "City Test",
    "State Test",
    "ZipCode Test",
);

const invoiceItem = new InvoiceItem({
    id: new Id("1"),
    name: "Invoice Item Test",
    price: 100,
})

const invoice = new Invoice({
    id: new Id("1"),
    name: "Invoice Test",
    document: "Document Test",
    address: address,
    items: [invoiceItem],
})

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    }
}

describe("FindInvoice usecase unit test", () => {
    it("should find an invoice", async () => {
        const invoiceRepository = MockRepository();
        const useCase = new FindInvoiceUseCase(invoiceRepository);

        const input = {
            id: "1"
        }

        const foundedInvoice = await useCase.execute(input);

        expect(invoiceRepository.find).toHaveBeenCalled();
        expect(foundedInvoice.id).toEqual(invoice.id.id);
        expect(foundedInvoice.name).toEqual(invoice.name);
        expect(foundedInvoice.document).toEqual(invoice.document);
        expect(foundedInvoice.address).toEqual({
            street: "Street Test",
            number: "1",
            complement: "",
            city: "City Test",
            state: "State Test",
            zipCode: "ZipCode Test",
        });
        expect(foundedInvoice.items).toEqual([
            {
                id: invoiceItem.id.id,
                name: invoiceItem.name,
                price: invoiceItem.price,
            }
        ]);
        expect(foundedInvoice.total).toEqual(invoice.total());
        expect(foundedInvoice.createdAt).toBeDefined();
    });
});
