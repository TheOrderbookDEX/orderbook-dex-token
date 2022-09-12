import { Account } from '@theorderbookdex/contract-test-helper';
import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleState } from '../state/PreSaleState';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export interface BuyPreSaleActionProperties extends PreSaleActionProperties {
    readonly account?: Account;
    readonly value: bigint;
}

export class BuyPreSaleAction extends PreSaleAction {
    readonly account: Account;
    readonly value: bigint;

    constructor({
        account = Account.MAIN,
        value,
        ...rest
    }: BuyPreSaleActionProperties) {
        super(rest);
        this.account = account;
        this.value = value;
    }

    async execute({ preSale, [this.account]: from }: PreSaleContext) {
        const { value } = this;
        await preSale.buy({ value, from });
    }

    apply<T>(state: T) {
        if (state instanceof PreSaleState) {
            return state.buy(this.account, this.value) as T;
        }
        return state;
    }
}
