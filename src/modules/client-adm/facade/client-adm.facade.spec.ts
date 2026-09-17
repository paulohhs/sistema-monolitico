import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeFactory from "../factory/facade.factory";

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
            address: "Address Test",
        }
        await facade.add(input);

        const product = await ClientModel.findOne({
            where: { id: "1" }
        });
        expect(product).not.toBeNull();
        expect(product.id).toBe(input.id);
        expect(product.name).toBe(input.name);
        expect(product.email).toBe(input.email);
        expect(product.address).toBe(input.address);
    });

    it("should find a client", async () => {
        // const repository = new ClientRepository();
        // const findUseCase = new FindClientUseCase(repository);
        // const facade = new ClientAdmFacade({
        //     addUseCase: undefined,
        //     findUseCase: findUseCase,
        // });
        
        const facade = ClientAdmFacadeFactory.create();

        await ClientModel.create({
            id: "1",
            name: "Client Test",
            email: "client@test.com",
            address: "Address Test",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const result = await facade.find({id: "1"});
        expect(result).not.toBeNull();
        expect(result.id).toBe("1");
        expect(result.name).toBe("Client Test");
        expect(result.email).toBe("client@test.com");
        expect(result.address).toBe("Address Test");
    });
});
