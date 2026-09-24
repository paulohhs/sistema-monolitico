import Address from "../../../@shared/domain/value-object/address";
import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn(),
    }
};

describe("Add Client test", () => {
    it("should add a client", async () => {
        const clientRepository = MockRepository();
        const useCase = new AddClientUseCase(clientRepository);

        const input = {
            name: "Client Test",
            email: "client@test.com",
            document: "123-456",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888",
            )
        }
        const result = await useCase.execute(input);

        expect(clientRepository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.email).toEqual(input.email);
        expect(result.address).toEqual({
            street: input.address.street,
            number: input.address.number,
            complement: input.address.complement,
            city: input.address.city,
            state: input.address.state,
            zipCode: input.address.zipCode,
        });
    });
});
