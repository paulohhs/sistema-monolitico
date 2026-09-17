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
            address: "Address Test",
        }
        const result = await useCase.execute(input);

        expect(clientRepository.add).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.email).toEqual(input.email);
        expect(result.address).toEqual(input.address);
    });
});
