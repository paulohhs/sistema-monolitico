import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("ProductRepository test", () => {
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
        const client = new Client({
            id: new Id("1"),
            name: "Client Test",
            email: "client@test.com",
            address: "Address Test",
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        const clientRepository = new ClientRepository();
        await clientRepository.add(client);

        const result = await ClientModel.findOne({ where: { id: "1" }});
        expect(result).toBeDefined();
        expect(result.id).toEqual(client.id.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toEqual(client.email);
        expect(result.address).toEqual(client.address);
        expect(result.createdAt).toEqual(client.createdAt);
        expect(result.updatedAt).toEqual(client.updatedAt);
    });

    it("should find a client", async () => {
        const client = await ClientModel.create({
            id: "1",
            name: "Client Test",
            email: "client@test.com",
            address: "Address Test",
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        const clientRepository = new ClientRepository();
        const result = await clientRepository.find(client.id)

        expect(result.id.id).toEqual(client.id);
        expect(result.name).toEqual(client.name);
        expect(result.email).toEqual(client.email);
        expect(result.address).toEqual(client.address);
        expect(result.createdAt).toEqual(client.createdAt);
        expect(result.updatedAt).toEqual(client.updatedAt);
    });
});
