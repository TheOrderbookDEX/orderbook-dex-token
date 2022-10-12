import { setChainTime } from '@frugal-wizard/contract-test-helper';
import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleStage, PreSaleState } from '../state/PreSaleState';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type FastForwardToStartActionProperties = PreSaleActionProperties;

export class FastForwardToStartAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await setChainTime(Number(await preSale.startTime()));
    }

    apply<T>(state: T) {
        if (state instanceof PreSaleState) {
            return state.fastForwardTo(PreSaleStage.START) as T;
        }
        return state;
    }
}
