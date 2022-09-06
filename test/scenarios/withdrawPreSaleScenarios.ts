import { generatorChain } from '@theorderbookdex/contract-test-helper';
import { NotEnded, NothingToWithdraw, Unauthorized } from '../../src/OrderbookDEXPreSale';
import { BuyPreSaleAction } from '../action/BuyPreSaleAction';
import { FastForwardToEndAction } from '../action/FastForwardToEndAction';
import { FastForwardToStartAction } from '../action/FastForwardToStartAction';
import { WithdrawPreSaleAction } from '../action/WithdrawPreSaleAction';
import { describer } from '../describer/describer';
import { WithdrawPreSaleScenario } from '../scenario/WithdrawPreSaleScenario';
import { ETHER } from '../utils/eth-units';

export const withdrawPreSaleScenarios = [
    // MAIN SCENARIOS
    ...generatorChain(function*() {
        yield {
            describer,
        };

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
                new FastForwardToEndAction({ describer }),
            ],
        };

    }).then(function*(properties) {
        yield new WithdrawPreSaleScenario(properties);
    }),

    // ERROR SCENARIOS
    ...generatorChain(function*() {
        yield {
            describer,
            treasury: '0x1000000000000000000000000000000000000001',
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER }),
                new FastForwardToEndAction({ describer }),
            ],
            expectedError: Unauthorized,
        };
        yield {
            describer,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER }),
            ],
            expectedError: NotEnded,
        };
        yield {
            describer,
            setupActions: [
                new FastForwardToStartAction({ describer }),
                new BuyPreSaleAction({ describer, value: ETHER }),
                new FastForwardToEndAction({ describer }),
                new WithdrawPreSaleAction({ describer }),
            ],
            expectedError: NothingToWithdraw,
        };

    }).then(function*(properties) {
        yield new WithdrawPreSaleScenario(properties);
    })
];
