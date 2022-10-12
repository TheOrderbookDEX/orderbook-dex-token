import { generatorChain } from '@frugal-wizard/contract-test-helper';
import { Ended, NothingToCancel } from '../../src/OrderbookDEXPreSale';
import { BuyPreSaleAction } from '../action/BuyPreSaleAction';
import { CancelPreSaleAction } from '../action/CancelPreSaleAction';
import { FastForwardToEndAction } from '../action/FastForwardToEndAction';
import { FastForwardToStartAction } from '../action/FastForwardToStartAction';
import { describer } from '../describer/describer';
import { CancelPreSaleScenario } from '../scenario/CancelPreSaleScenario';
import { ETHER } from '../utils/eth-units';

export const cancelPreSaleScenarios = [
    // MAIN SCENARIOS
    ...generatorChain(function*() {
        yield { describer };

    }).then(function*(properties) {
        for (const exchangeRate of [
            ETHER * 1n,
            ETHER * 10n,
            ETHER / 10n,
            ETHER / 3n,
        ]) {
            yield {
                ...properties,
                exchangeRate,
            };
        }

    }).then(function*(properties) {
        yield {
            ...properties,
            setupActions: [
                new FastForwardToStartAction({ describer }),
            ],
        };

    }).then(function*(properties) {
        for (const value of [
            ETHER * 1n,
            ETHER * 2n,
            ETHER * 3n,
            ETHER / 2n,
            ETHER / 3n,
        ]) {
            yield {
                ...properties,
                setupActions: [
                    ...properties.setupActions,
                    new BuyPreSaleAction({ describer, value }),
                ],
            };
        }

    }).then(function*(properties) {
        yield properties;

        for (const value of [
            ETHER * 1n,
            ETHER * 2n,
            ETHER * 3n,
            ETHER / 2n,
            ETHER / 3n,
        ]) {
            yield {
                ...properties,
                setupActions: [
                    ...properties.setupActions,
                    new BuyPreSaleAction({ describer, value }),
                ],
            };
        }

    }).then(function*(properties) {
        yield new CancelPreSaleScenario(properties);
    }),

    // PRE SALE NOT SUCCESSFUL SCENARIOS
    ...generatorChain(function*() {
        yield {
            describer,
            successThreshold: ETHER * 1n + 1n,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
                new FastForwardToEndAction({ describer }),
            ],
        };

    }).then(function*(properties) {
        yield new CancelPreSaleScenario(properties);
    }),

    // ERROR SCENARIOS
    ...generatorChain(function*() {
        yield {
            describer,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
                new FastForwardToEndAction({ describer }),
            ],
            expectedError: Ended,
        };
        yield {
            describer,
            setupActions: [
                new FastForwardToStartAction({ describer }),
            ],
            expectedError: NothingToCancel,
        };
        yield {
            describer,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
                new CancelPreSaleAction({ describer }),
            ],
            expectedError: NothingToCancel,
        };

    }).then(function*(properties) {
        yield new CancelPreSaleScenario(properties);
    }),
];
