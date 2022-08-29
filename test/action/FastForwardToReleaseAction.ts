import { PreSaleContext } from '../scenario/PreSaleScenario';
import { setChainTime } from '../utils/ethereum';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type FastForwardToReleaseActionProperties = PreSaleActionProperties;

export class FastForwardToReleaseAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await setChainTime(Number(await preSale.releaseTime()));
    }

    apply<T>(state: T) {
        return state;
    }
}
