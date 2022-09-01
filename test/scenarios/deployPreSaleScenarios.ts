import { parseValue } from '@theorderbookdex/abi2ts-lib';
import { generatorChain, TestError } from '@theorderbookdex/contract-test-helper';
import { ExchangeRate } from '../../src/OrderbookDEXPreSale';
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
        exchangeRate: new ExchangeRate(10n, 1n),
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
        expectedError: Error as TestError, // TODO fix type in contract-test-helper
    };
    yield {
        describer,
        releaseTimeOffset: 0n,
        expectedError: Error as TestError, // TODO fix type in contract-test-helper
    };
    yield {
        describer,
        exchangeRate: new ExchangeRate(0n, 1n),
        expectedError: Error as TestError, // TODO fix type in contract-test-helper
    };
    yield {
        describer,
        exchangeRate: new ExchangeRate(1n, 0n),
        expectedError: Error as TestError, // TODO fix type in contract-test-helper
    };
    yield {
        describer,
        vestingPeriod: 0n,
        expectedError: Error as TestError, // TODO fix type in contract-test-helper
    };
    yield {
        describer,
        vestedAmountPerPeriod: 0n,
        expectedError: Error as TestError, // TODO fix type in contract-test-helper
    };

}).then(function*(properties) {
    yield new DeployPreSaleScenario(properties);
});
