import express, {Request, Response} from "express";
import ClientAdmFacadeFactory from "../../../client-adm/factory/facade.factory";
import Address from "../../../@shared/domain/value-object/address";

export const clientsRoute = express.Router();

clientsRoute.post('/', async (req: Request, res: Response) => {
    const clientFacade = ClientAdmFacadeFactory.create();

    try {
        const clientDto = {
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            address: new Address(
                req.body.address.street,
                req.body.address.number,
                req.body.address.complement,
                req.body.address.city,
                req.body.address.state,
                req.body.address.zipCode,
            )
        }

        const output = await clientFacade.add(clientDto);

        res.status(201).send(output);
    } catch (err: any) {
        res.status(500).send({ error: err.message });
    }
});
