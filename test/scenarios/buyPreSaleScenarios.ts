import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { BuyPreSaleScenario } from '../scenario/BuyPreSaleScenario';
import { FastForwardToStartAction } from '../action/FastForwardToStartAction';
import { BuyLimitReached, Ended, NotEnoughFunds, NotStarted, SoldOut } from '../../src/OrderbookDEXPreSale';
import { FastForwardToEndAction } from '../action/FastForwardToEndAction';
import { BuyPreSaleAction } from '../action/BuyPreSaleAction';
import { PRE_SALE_TOKENS } from '../utils/tokenomics';
import { ETHER } from '../utils/eth-units';
import { MAX_UINT256 } from '@theorderbookdex/abi2ts-lib';

export const buyPreSaleScenarios = [
    // MAIN SCENARIOS
    ...generatorChain(function*() {
        yield {
            describer,
        };

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
        for (const buyLimit of [
            MAX_UINT256,
            ETHER * 2n,
            ETHER * 3n,
        ]) {
            yield {
                ...properties,
                buyLimit,
            };
        }

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
                value,
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
        yield properties;

        const { exchangeRate, buyLimit } = properties;

        for (const value of [
            ETHER * 1n,
            ETHER * 2n,
            ETHER * 3n,
            ETHER / 2n,
            ETHER / 3n,
        ]) {
            const amountBought = value * exchangeRate / ETHER;

            yield {
                ...properties,
                setupActions: [
                    ...properties.setupActions,
                    new BuyPreSaleAction({ describer, value }),
                ],
                expectedError: amountBought >= buyLimit ? BuyLimitReached : undefined,
            };
        }

    }).then(function*(properties) {
        yield new BuyPreSaleScenario(properties);
    }),

    // EDGE SCENARIOS
    ...generatorChain(function*() {
        yield {
            describer,
            value: ETHER * 1n,
            setupActions: [
                new FastForwardToStartAction({ describer }),
            ],
        };

    }).then(function*(properties) {
        yield {
            ...properties,
            exchangeRate: PRE_SALE_TOKENS - 1n, // buy almost all with 1 ether
            setupActions: [
                ...properties.setupActions,
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
            ],
        };
        yield {
            ...properties,
            exchangeRate: 1n,
            value: ETHER * 1n - 1n,
            expectedError: NotEnoughFunds,
        };
        yield {
            ...properties,
            exchangeRate: 1n,
            value: ETHER * 1n + 1n,
        };

    }).then(function*(properties) {
        yield new BuyPreSaleScenario(properties);
    }),

    // ERROR SCENARIOS
    ...generatorChain(function*() {
        yield {
            describer,
            value: ETHER * 1n,
            setupActions: [
                new FastForwardToStartAction({ describer }),
            ],
        };

    }).then(function*(properties) {
        yield {
            ...properties,
            setupActions: [],
            expectedError: NotStarted,
        };
        yield {
            ...properties,
            setupActions: [
                new FastForwardToEndAction({ describer }),
            ],
            expectedError: Ended,
        };
        yield {
            ...properties,
            exchangeRate: PRE_SALE_TOKENS, // buy all with 1 ether
            setupActions: [
                ...properties.setupActions,
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
            ],
            expectedError: SoldOut,
        };
        yield {
            ...properties,
            value: 0n,
            expectedError: NotEnoughFunds,
        };

    }).then(function*(properties) {
        yield new BuyPreSaleScenario(properties);
    }),
];
