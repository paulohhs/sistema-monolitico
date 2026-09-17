import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ProductRepository from "./product.repository";

describe("ProductRepository test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should find a product", async () => {
        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            salesPrice: 100,
        });
        
        const productRepository = new ProductRepository();
        const product = await productRepository.find("1");
        
        expect(product.id.id).toEqual("1");
        expect(product.name).toEqual("Product 1");
        expect(product.description).toEqual("Product 1 description");
        expect(product.salesPrice).toEqual(100);
    });

    it("should find all products", async () => {
        await ProductModel.create({
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            salesPrice: 100,
        });

        await ProductModel.create({
            id: "2",
            name: "Product 2",
            description: "Product 2 description",
            salesPrice: 200,
        });
        
        const productRepository = new ProductRepository();
        const products = await productRepository.findAll();

        expect(products.length).toBe(2)
        expect(products[0].id.id).toEqual("1");
        expect(products[0].name).toEqual("Product 1");
        expect(products[0].description).toEqual("Product 1 description");
        expect(products[0].salesPrice).toEqual(100);

        expect(products[1].id.id).toEqual("2");
        expect(products[1].name).toEqual("Product 2");
        expect(products[1].description).toEqual("Product 2 description");
        expect(products[1].salesPrice).toEqual(200);
    });
});
