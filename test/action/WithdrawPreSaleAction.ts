import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type WithdrawPreSaleActionProperties = PreSaleActionProperties;

export class WithdrawPreSaleAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await preSale.withdraw();
    }

    apply<T>(state: T) {
        return state;
    }
}
