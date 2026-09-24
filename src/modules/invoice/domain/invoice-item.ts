import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

type InvoiceItemProps = {
    id?: Id;
    productId: string,
    name: string;
    price: number;
}

export default class InvoiceItem extends BaseEntity implements AggregateRoot {
    private _productId: string;
    private _name: string;
    private _price: number;

    constructor(props: InvoiceItemProps) {
        super(props.id);
        this._productId = props.productId;
        this._name = props.name;
        this._price = props.price;
    }

    get productId(): string {
        return this._productId;
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return this._price;
    }
}
