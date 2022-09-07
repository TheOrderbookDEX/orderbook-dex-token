import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type CancelPreSaleActionProperties = PreSaleActionProperties;

export class CancelPreSaleAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await preSale.cancel();
    }

    apply<T>(state: T) {
        return state;
    }
}
