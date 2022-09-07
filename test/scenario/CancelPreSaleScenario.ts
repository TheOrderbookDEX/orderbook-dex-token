import { Transaction } from '@theorderbookdex/abi2ts-lib';
import { PreSaleContext, PreSaleScenario, PreSaleScenarioProperties } from './PreSaleScenario';

export type CancelPreSaleScenarioProperties = PreSaleScenarioProperties<PreSaleContext>;

export class CancelPreSaleScenario extends PreSaleScenario<PreSaleContext, Transaction, [bigint, bigint]> {
    async setup() {
        return await this._setup();
    }

    async execute({ preSale }: PreSaleContext) {
        return await preSale.cancel();
    }

    async executeStatic({ preSale }: PreSaleContext) {
        return await preSale.callStatic.cancel();
    }
}
