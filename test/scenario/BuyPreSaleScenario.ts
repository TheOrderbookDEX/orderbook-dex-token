import { formatValue, Transaction } from '@theorderbookdex/abi2ts-lib';
import { Account, AddContextFunction } from '@theorderbookdex/contract-test-helper';
import { PreSaleContext, PreSaleScenario, PreSaleScenarioProperties } from './PreSaleScenario';

export interface BuyPreSaleScenarioProperties extends PreSaleScenarioProperties<PreSaleContext> {
    readonly value: bigint;
}

export class BuyPreSaleScenario extends PreSaleScenario<PreSaleContext, Transaction, [bigint, bigint]> {
    readonly value: bigint;

    constructor({
        value,
        ...rest
    }: BuyPreSaleScenarioProperties) {
        super(rest);
        this.value = value;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('value', formatValue(this.value));
        super.addContext(addContext);
    }

    async setup() {
        return await this._setup();
    }

    async execute({ preSale }: PreSaleContext) {
        const { value } = this;
        return await preSale.buy({ value });
    }

    async executeStatic({ preSale }: PreSaleContext) {
        const { value } = this;
        return await preSale.callStatic.buy({ value });
    }

    get expectedAmountBought(): bigint {
        return this.stateBefore.calculateBoughtTokens(Account.MAIN, this.value)[0];
    }

    get expectedAmountPaid(): bigint {
        return this.stateBefore.calculateBoughtTokens(Account.MAIN, this.value)[1];
    }
}
