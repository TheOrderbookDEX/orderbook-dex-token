import { setChainTime } from '@frugal-wizard/contract-test-helper';
import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleStage, PreSaleState } from '../state/PreSaleState';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type FastForwardToEndActionProperties = PreSaleActionProperties;

export class FastForwardToEndAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await setChainTime(Number(await preSale.endTime()));
    }

    apply<T>(state: T) {
        if (state instanceof PreSaleState) {
            return state.fastForwardTo(PreSaleStage.END) as T;
        }
        return state;
    }
}
