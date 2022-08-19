import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { DeployPreSaleScenario, DeployPreSaleScenarioProperties } from '../scenario/DeployPreSaleScenario';
import { ExchangeRate } from '../../src/OrderbookDEXPreSale';

export const deployPreSaleScenarios: Iterable<DeployPreSaleScenario> = generatorChain(function*(): Iterable<DeployPreSaleScenarioProperties> {
    yield {
        describer,
        token: '0x0000000000000000000000000000000000000001',
        treasury: '0x0000000000000000000000000000000000000002',
        startTimeOffset: 0n,
        endTimeOffset: 1n,
        releaseTimeOffset: 2n,
        exchangeRate: new ExchangeRate(1n, 2n),
    };
    // TODO add more deploy pre-sale test scenarios

}).then(function*(properties) {
    yield new DeployPreSaleScenario(properties);
});
