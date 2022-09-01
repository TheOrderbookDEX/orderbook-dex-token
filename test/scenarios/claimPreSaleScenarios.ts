import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { parseValue } from '@theorderbookdex/abi2ts-lib';
import { ClaimPreSaleScenario } from '../scenario/ClaimPreSaleScenario';
import { BuyPreSaleAction } from '../action/BuyPreSaleAction';
import { FastForwardToVestingAction } from '../action/FastForwardToVestingAction';
import { FastForwardToStartAction } from '../action/FastForwardToStartAction';

export const claimPreSaleScenarios = generatorChain(function*() {
    yield {
        describer,
        setupActions: [
            new FastForwardToStartAction({ describer }),
            new BuyPreSaleAction({ describer, value: parseValue(1) }),
            new FastForwardToVestingAction({ describer }),
        ],
    };
    // TODO add more buy pre-sale test scenarios

}).then(function*(properties) {
    yield new ClaimPreSaleScenario(properties);
});
