import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type ClaimPreSaleActionProperties = PreSaleActionProperties;

export class ClaimPreSaleAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await preSale.claim();
    }

    apply<T>(state: T) {
        return state;
    }
}
