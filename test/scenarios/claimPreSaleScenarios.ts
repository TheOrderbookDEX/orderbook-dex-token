import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { describer } from '../describer/describer';
import { ClaimPreSaleScenario } from '../scenario/ClaimPreSaleScenario';
import { BuyPreSaleAction } from '../action/BuyPreSaleAction';
import { FastForwardToVestingAction } from '../action/FastForwardToVestingAction';
import { FastForwardToStartAction } from '../action/FastForwardToStartAction';
import { ETHER } from '../utils/eth-units';
import { FastForwardToReleaseAction } from '../action/FastForwardToReleaseAction';
import { ClaimPreSaleAction } from '../action/ClaimPreSaleAction';
import { NothingToClaim, NotReleased, NotSuccessful } from '../../src/OrderbookDEXPreSale';
import { CancelPreSaleAction } from '../action/CancelPreSaleAction';

export const claimPreSaleScenarios = [
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
        for (const availableAtRelease of [
            ETHER / 10n,
            ETHER / 3n,
        ]) {
            yield {
                ...properties,
                availableAtRelease,
            };
        }

    }).then(function*(properties) {
        for (const vestedAmountPerPeriod of [
            ETHER / 10n,
            ETHER / 3n,
        ]) {
            yield {
                ...properties,
                vestedAmountPerPeriod,
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
        yield {
            ...properties,
            setupActions: [
                ...properties.setupActions,
                new FastForwardToReleaseAction({ describer }),
            ],
        };
        yield {
            ...properties,
            setupActions: [
                ...properties.setupActions,
                new FastForwardToVestingAction({ describer }),
            ],
        };
        yield {
            ...properties,
            setupActions: [
                ...properties.setupActions,
                new FastForwardToReleaseAction({ describer }),
                new ClaimPreSaleAction({ describer }),
                new FastForwardToVestingAction({ describer }),
            ],
        };
        yield {
            ...properties,
            setupActions: [
                ...properties.setupActions,
                new FastForwardToVestingAction({ describer, period: 2 }),
            ],
        };
        yield {
            ...properties,
            setupActions: [
                ...properties.setupActions,
                new FastForwardToVestingAction({ describer }),
                new ClaimPreSaleAction({ describer }),
                new FastForwardToVestingAction({ describer, period: 2 }),
            ],
        };

    }).then(function*(properties) {
        yield new ClaimPreSaleScenario(properties);
    }),

    // EDGE SCENARIOS
    ...generatorChain(function*() {
        yield {
            describer,
            availableAtRelease: ETHER / 10n,
            vestedAmountPerPeriod: ETHER / 10n,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
                new FastForwardToVestingAction({ describer, period: 10 }),
            ],
        };

    }).then(function*(properties) {
        yield new ClaimPreSaleScenario(properties);
    }),

    // ERROR SCENARIOS
    ...generatorChain(function*() {
        yield {
            describer,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
            ],
            expectedError: NotReleased,
        };
        yield {
            describer,
            successThreshold: ETHER * 1n + 1n,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
                new FastForwardToReleaseAction({ describer }),
            ],
            expectedError: NotSuccessful,
        };
        yield {
            describer,
            setupActions: [
                new FastForwardToReleaseAction({ describer }),
            ],
            expectedError: NothingToClaim,
        };
        yield {
            describer,
            availableAtRelease: ETHER / 10n,
            vestedAmountPerPeriod: ETHER / 10n,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
                new CancelPreSaleAction({ describer }),
                new FastForwardToReleaseAction({ describer }),
            ],
            expectedError: NothingToClaim,
        };
        yield {
            describer,
            availableAtRelease: ETHER / 10n,
            vestedAmountPerPeriod: ETHER / 10n,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
                new FastForwardToReleaseAction({ describer }),
                new ClaimPreSaleAction({ describer }),
            ],
            expectedError: NothingToClaim,
        };
        yield {
            describer,
            availableAtRelease: ETHER / 10n,
            vestedAmountPerPeriod: ETHER / 10n,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
                new FastForwardToVestingAction({ describer }),
                new ClaimPreSaleAction({ describer }),
            ],
            expectedError: NothingToClaim,
        };
        yield {
            describer,
            availableAtRelease: ETHER / 10n,
            vestedAmountPerPeriod: ETHER / 10n,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER * 1n }),
                new FastForwardToVestingAction({ describer, period: 9 }),
                new ClaimPreSaleAction({ describer }),
                new FastForwardToVestingAction({ describer, period: 10 }),
            ],
            expectedError: NothingToClaim,
        };

    }).then(function*(properties) {
        yield new ClaimPreSaleScenario(properties);
    }),
];
