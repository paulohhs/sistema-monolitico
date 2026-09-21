import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import PaymentFacedeFactory from "../factory/payment.facade.factory";

describe("PaymentFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([TransactionModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a transaction", async () => {
        // const paymentRepository = new TransactionRepository();
        // const useCase = new ProcessPaymentUseCase(paymentRepository);
        // const facade = new PaymentFacade(useCase);
        const facade = PaymentFacedeFactory.create();

        const input = {
            orderId: "1",
            amount: 100,
        }

        const output = await facade.process(input);

        expect(output.transactionId).toBeDefined();
        expect(output.orderId).toBe(input.orderId);
        expect(output.amount).toBe(input.amount);
        expect(output.status).toBe("approved");
    });
});
