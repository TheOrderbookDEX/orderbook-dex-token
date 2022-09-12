import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleState } from '../state/PreSaleState';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type WithdrawPreSaleActionProperties = PreSaleActionProperties;

export class WithdrawPreSaleAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await preSale.withdraw();
    }

    apply<T>(state: T) {
        if (state instanceof PreSaleState) {
            return state.withdraw() as T;
        }
        return state;
    }
}
