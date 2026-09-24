import express, {Request, Response} from "express";
import OrderFacadeFactory from "../../../checkout/factory/facade.factory";

export const checkoutRoute = express.Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {
    const checkoutFacade = OrderFacadeFactory.create();

    try {
        const products = req.body.products.map((product: any) => ({
            productId: product
        }));
        const orderDto = {
            clientId: req.body.clientId,
            products: products,
        }

        const output = await checkoutFacade.add(orderDto);
        res.status(201).send(output);
    } catch (err: any) {
        res.status(500).send({ error: err.message });
    }
});
