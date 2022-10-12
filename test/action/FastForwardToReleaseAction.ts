import { setChainTime } from '@frugal-wizard/contract-test-helper';
import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleStage, PreSaleState } from '../state/PreSaleState';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type FastForwardToReleaseActionProperties = PreSaleActionProperties;

export class FastForwardToReleaseAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await setChainTime(Number(await preSale.releaseTime()));
    }

    apply<T>(state: T) {
        if (state instanceof PreSaleState) {
            return state.fastForwardTo(PreSaleStage.RELEASE) as T;
        }
        return state;
    }
}
