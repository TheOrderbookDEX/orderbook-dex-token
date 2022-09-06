import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { DeployPreSaleScenario, DeployPreSaleScenarioProperties } from '../scenario/DeployPreSaleScenario';
import { ETHER } from '../utils/eth-units';
import { ONE_DAY } from '../utils/timestamp';

export const deployPreSaleScenarios: Iterable<DeployPreSaleScenario> = generatorChain(function*(): Iterable<DeployPreSaleScenarioProperties> {
    // MAIN SCENARIOS
    yield {
        describer,
    };
    yield {
        describer,
        token: '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    };
    yield {
        describer,
        treasury: '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
    };
    yield {
        describer,
        startTimeOffset: ONE_DAY,
    };
    yield {
        describer,
        endTimeOffset: ONE_DAY,
    };
    yield {
        describer,
        releaseTimeOffset: ONE_DAY,
    };
    yield {
        describer,
        exchangeRate: ETHER * 10n,
    };
    yield {
        describer,
        availableAtRelease: ETHER / 10n,
    };
    yield {
        describer,
        vestingPeriod: ONE_DAY,
    };
    yield {
        describer,
        vestedAmountPerPeriod: ETHER / 10n,
    };
    yield {
        describer,
        buyLimit: ETHER,
    };

    // ERROR SCENARIOS
    yield {
        describer,
        endTimeOffset: 0n,
        expectedError: Error,
    };
    yield {
        describer,
        releaseTimeOffset: 0n,
        expectedError: Error,
    };
    yield {
        describer,
        exchangeRate: 0n,
        expectedError: Error,
    };
    yield {
        describer,
        vestingPeriod: 0n,
        expectedError: Error,
    };
    yield {
        describer,
        vestedAmountPerPeriod: 0n,
        expectedError: Error,
    };
    yield {
        describer,
        buyLimit: 0n,
        expectedError: Error,
    };

}).then(function*(properties) {
    yield new DeployPreSaleScenario(properties);
});
