import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export interface BuyPreSaleActionProperties extends PreSaleActionProperties {
    readonly value: bigint;
}

export class BuyPreSaleAction extends PreSaleAction {
    readonly value: bigint;

    constructor({
        value,
        ...rest
    }: BuyPreSaleActionProperties) {
        super(rest);
        this.value = value;
    }

    async execute({ preSale }: PreSaleContext) {
        const { value } = this;
        await preSale.buy({ value });
    }

    apply<T>(state: T) {
        return state;
    }
}
