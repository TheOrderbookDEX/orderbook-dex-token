import { Transaction } from '@frugal-wizard/abi2ts-lib';
import { PreSaleContext, PreSaleScenario, PreSaleScenarioProperties } from './PreSaleScenario';

export type ClaimPreSaleScenarioProperties = PreSaleScenarioProperties<PreSaleContext>;

export class ClaimPreSaleScenario extends PreSaleScenario<PreSaleContext, Transaction, bigint> {
    async setup() {
        return await this._setup();
    }

    async execute({ preSale }: PreSaleContext) {
        return await preSale.claim();
    }

    async executeStatic({ preSale }: PreSaleContext) {
        return await preSale.callStatic.claim();
    }
}
