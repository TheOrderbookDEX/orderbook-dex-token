import { Account } from '@theorderbookdex/contract-test-helper';
import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleState } from '../state/PreSaleState';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type ClaimPreSaleActionProperties = PreSaleActionProperties;

export class ClaimPreSaleAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await preSale.claim();
    }

    apply<T>(state: T) {
        if (state instanceof PreSaleState) {
            return state.claim(Account.MAIN) as T;
        }
        return state;
    }
}
