import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
    id: new Id("1"),
    name: "Client Test",
    email: "client@test.com",
    address: "Address Test"
})

const MockRepository = () => {
    return {
        add: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(client)),
    }
};

describe("Find Client Usecase unit test", () => {
    it("should find a client", async () => {
        const clientRepository = MockRepository();
        const useCase = new FindClientUseCase(clientRepository);

        const input = {
            id: "1"
        }
        const clientFound = await useCase.execute(input);

        expect(clientRepository.find).toHaveBeenCalled();
        expect(clientFound.id).toEqual(input.id);
        expect(clientFound.name).toEqual(client.name);
        expect(clientFound.email).toEqual(client.email);
        expect(clientFound.address).toEqual(client.address);
    });
});
