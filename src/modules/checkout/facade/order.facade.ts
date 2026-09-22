import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import OrderFacadeInterface, { PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./order.facade.interface";

export interface UseCasesProps {
    addUseCase: UseCaseInterface;
}

export default class OrderFacade implements OrderFacadeInterface {
    private _addUseCase: UseCaseInterface;

    constructor(usecasesProps: UseCasesProps) {
        this._addUseCase = usecasesProps.addUseCase;
    }

    add(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
        return this._addUseCase.execute(input);
    }
}
