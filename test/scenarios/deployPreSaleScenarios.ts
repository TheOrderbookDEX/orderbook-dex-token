import { parseValue } from '@theorderbookdex/abi2ts-lib';
import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { DeployPreSaleScenario, DeployPreSaleScenarioProperties } from '../scenario/DeployPreSaleScenario';
import { ONE_DAY } from '../utils/timestamp';

export const deployPreSaleScenarios: Iterable<DeployPreSaleScenario> = generatorChain(function*(): Iterable<DeployPreSaleScenarioProperties> {
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
        exchangeRate: parseValue(10),
    };
    yield {
        describer,
        availableAtRelease: parseValue(0.1),
    };
    yield {
        describer,
        vestingPeriod: ONE_DAY,
    };
    yield {
        describer,
        vestedAmountPerPeriod: parseValue(0.1),
    };

    // ERRORS
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

}).then(function*(properties) {
    yield new DeployPreSaleScenario(properties);
});
