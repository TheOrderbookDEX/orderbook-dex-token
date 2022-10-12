import { Transaction } from '@frugal-wizard/abi2ts-lib';
import { PreSaleContext, PreSaleScenario, PreSaleScenarioProperties } from './PreSaleScenario';

export type WithdrawPreSaleScenarioProperties = PreSaleScenarioProperties<PreSaleContext>;

export class WithdrawPreSaleScenario extends PreSaleScenario<PreSaleContext, Transaction, bigint> {
    async setup() {
        return await this._setup();
    }

    async execute({ preSale }: PreSaleContext) {
        return await preSale.withdraw();
    }

    async executeStatic({ preSale }: PreSaleContext) {
        return await preSale.callStatic.withdraw();
    }
}
