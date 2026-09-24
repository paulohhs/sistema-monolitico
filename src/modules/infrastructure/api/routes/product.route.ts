import express, {Request, Response} from "express";
import ProductAdmFacadeFactory from "../../../product-adm/factory/facade.factory";

export const productsRoute = express.Router();

productsRoute.post('/', async (req: Request, res: Response) => {
    const productFacade = ProductAdmFacadeFactory.create();

    try {
        const productDto = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock,
        }

        const output = await productFacade.addProduct(productDto);

        res.status(201).send(output);
    } catch (err: any) {
        res.status(500).send({ error: err.message });
    }
});
