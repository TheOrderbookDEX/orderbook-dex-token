import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { ExchangeRate } from '../../src/OrderbookDEXPreSale';
import { BuyPreSaleScenario } from '../scenario/BuyPreSaleScenario';
import { parseValue } from '@theorderbookdex/abi2ts-lib';

export const buyPreSaleScenarios = generatorChain(function*() {
    yield {
        describer,
        value: parseValue(1),
        exchangeRate: new ExchangeRate(1n, 2n),
    };
    // TODO add more buy pre-sale test scenarios

}).then(function*(properties) {
    yield new BuyPreSaleScenario(properties);
});
