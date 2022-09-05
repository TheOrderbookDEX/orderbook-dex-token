import { setChainTime } from '@theorderbookdex/contract-test-helper';
import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type FastForwardToEndActionProperties = PreSaleActionProperties;

export class FastForwardToEndAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await setChainTime(Number(await preSale.endTime()));
    }

    apply<T>(state: T) {
        return state;
    }
}
