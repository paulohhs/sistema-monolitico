import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeFactory from "../factory/facade.factory";
import Address from "../../@shared/domain/value-object/address";

describe("ClientAdmFacade test", () => {
    let sequelize: Sequelize;
    
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ClientModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a client", async () => {
        // const repository = new ClientRepository();
        // const addUseCase = new AddClientUseCase(repository);
        // const facade = new ClientAdmFacade({
        //     addUseCase: addUseCase,
        //     findUseCase: undefined,
        // });

        const facade = ClientAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Client Test",
            email: "client@test.com",
            document: "1234-5678",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888",
            )
        }
        const client = await facade.add(input);

        expect(client).not.toBeNull();
        expect(client.id).toBe(input.id);
        expect(client.name).toBe(input.name);
        expect(client.email).toBe(input.email);
        expect(client.document).toBe(input.document);
        expect(client.address.street).toBe(input.address.street);
    });

    it("should find a client", async () => {
        // const repository = new ClientRepository();
        // const findUseCase = new FindClientUseCase(repository);
        // const facade = new ClientAdmFacade({
        //     addUseCase: undefined,
        //     findUseCase: findUseCase,
        // });
        
        const facade = ClientAdmFacadeFactory.create();

        const input = {
            id: "1",
            name: "Client Test",
            email: "client@test.com",
            document: "1234-5678",
            street: "Rua 123",
            number: "99",
            complement: "Casa Verde",
            city: "Criciúma",
            state: "SC",
            zipcode: "88888-888",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
        await ClientModel.create(input);

        const result = await facade.find({id: "1"});
        expect(result).not.toBeNull();
        expect(result.id).toBe(input.id);
        expect(result.name).toBe(input.name);
        expect(result.email).toBe(input.email);
        expect(result.document).toBe(input.document);
        expect(result.address.street).toBe(input.street);
        expect(result.address.number).toBe(input.number);
        expect(result.address.complement).toBe(input.complement);
        expect(result.address.city).toBe(input.city);
        expect(result.address.state).toBe(input.state);
        expect(result.address.zipCode).toBe(input.zipcode);
    });
});
