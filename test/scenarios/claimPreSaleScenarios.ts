import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { ExchangeRate } from '../../src/OrderbookDEXPreSale';
import { parseValue } from '@theorderbookdex/abi2ts-lib';
import { ClaimPreSaleScenario } from '../scenario/ClaimPreSaleScenario';
import { BuyPreSaleAction } from '../action/BuyPreSaleAction';
import { FastForwardToReleaseAction } from '../action/FastForwardToReleaseAction';

export const claimPreSaleScenarios = generatorChain(function*() {
    yield {
        describer,
        exchangeRate: new ExchangeRate(1n, 2n),
        setupActions: [
            new BuyPreSaleAction({ describer, value: parseValue(1) }),
            new FastForwardToReleaseAction({ describer }),
        ],
    };
    // TODO add more buy pre-sale test scenarios

}).then(function*(properties) {
    yield new ClaimPreSaleScenario(properties);
});
