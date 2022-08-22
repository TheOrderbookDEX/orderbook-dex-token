import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { DeployPreSaleScenario, DeployPreSaleScenarioProperties } from '../scenario/DeployPreSaleScenario';
import { ExchangeRate } from '../../src/OrderbookDEXPreSale';

export const deployPreSaleScenarios: Iterable<DeployPreSaleScenario> = generatorChain(function*(): Iterable<DeployPreSaleScenarioProperties> {
    yield {
        describer,
        exchangeRate: new ExchangeRate(1n, 2n),
    };
    // TODO add more deploy pre-sale test scenarios

}).then(function*(properties) {
    yield new DeployPreSaleScenario(properties);
});
