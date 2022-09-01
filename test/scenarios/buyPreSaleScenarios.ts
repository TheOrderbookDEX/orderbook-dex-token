import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { BuyPreSaleScenario } from '../scenario/BuyPreSaleScenario';
import { parseValue } from '@theorderbookdex/abi2ts-lib';
import { FastForwardToStartAction } from '../action/FastForwardToStartAction';

export const buyPreSaleScenarios = generatorChain(function*() {
    yield {
        describer,
        value: parseValue(1),
        setupActions: [
            new FastForwardToStartAction({ describer }),
        ],
    };
    // TODO add more buy pre-sale test scenarios

}).then(function*(properties) {
    yield new BuyPreSaleScenario(properties);
});
