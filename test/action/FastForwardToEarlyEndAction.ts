import { setChainTime } from '@theorderbookdex/contract-test-helper';
import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleStage, PreSaleState } from '../state/PreSaleState';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type FastForwardToEarlyEndActionProperties = PreSaleActionProperties;

export class FastForwardToEarlyEndAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await setChainTime(Number(await preSale.earlyEndTime()));
    }

    apply<T>(state: T) {
        if (state instanceof PreSaleState) {
            return state.fastForwardTo(PreSaleStage.EARLY_END) as T;
        }
        return state;
    }
}
