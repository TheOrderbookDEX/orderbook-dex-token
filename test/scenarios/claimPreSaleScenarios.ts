import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { parseValue } from '@theorderbookdex/abi2ts-lib';
import { ClaimPreSaleScenario } from '../scenario/ClaimPreSaleScenario';
import { BuyPreSaleAction } from '../action/BuyPreSaleAction';
import { FastForwardToVestingAction } from '../action/FastForwardToVestingAction';

export const claimPreSaleScenarios = generatorChain(function*() {
    yield {
        describer,
        setupActions: [
            new BuyPreSaleAction({ describer, value: parseValue(1) }),
            new FastForwardToVestingAction({ describer }),
        ],
    };
    // TODO add more buy pre-sale test scenarios

}).then(function*(properties) {
    yield new ClaimPreSaleScenario(properties);
});
