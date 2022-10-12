import { Account } from '@frugal-wizard/contract-test-helper';
import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleState } from '../state/PreSaleState';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type CancelPreSaleActionProperties = PreSaleActionProperties;

export class CancelPreSaleAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await preSale.cancel();
    }

    apply<T>(state: T) {
        if (state instanceof PreSaleState) {
            return state.cancel(Account.MAIN) as T;
        }
        return state;
    }
}
