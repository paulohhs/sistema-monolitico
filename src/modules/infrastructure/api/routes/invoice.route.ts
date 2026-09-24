import express, {Request, Response} from "express";
import InvoiceFacadeFactory from "../../../invoice/factory/facade.factory";

export const invoiceRoute = express.Router();

invoiceRoute.get('/:id', async (req: Request, res: Response) => {
    const invoiceFacade = InvoiceFacadeFactory.create();

    try {
        const invoiceDto = {
            id: req.params.id,
        }

        const output = await invoiceFacade.find(invoiceDto);
        res.status(200).send(output);
    } catch (err: any) {
        res.status(500).send({ error: err.message });
    }
});
