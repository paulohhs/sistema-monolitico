import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface, { FindAllStoreCatalogFacadeOutputDto, FindStoreCatalogFacadeInputDto, FindStoreCatalogFacadeOutputDto } from "./store-catalog.facade.interface";

export interface UseCaseProps {
    findUseCase: FindProductUseCase,
    findAllUseCase: FindAllProductsUseCase,
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface{
    private _findUsecase: UseCaseInterface;
    private _findAllUsecase: UseCaseInterface;

    constructor(usecasesProps: UseCaseProps) {
        this._findUsecase = usecasesProps.findUseCase;
        this._findAllUsecase = usecasesProps.findAllUseCase;
    }

    async find(input: FindStoreCatalogFacadeInputDto): Promise<FindStoreCatalogFacadeOutputDto> {
        return await this._findUsecase.execute(input);
    }

    async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
        return await this._findAllUsecase.execute({});
    }

}
