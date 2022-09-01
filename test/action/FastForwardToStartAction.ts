import { setChainTime } from '@theorderbookdex/contract-test-helper';
import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export type FastForwardToStartActionProperties = PreSaleActionProperties;

export class FastForwardToStartAction extends PreSaleAction {
    async execute({ preSale }: PreSaleContext) {
        await setChainTime(Number(await preSale.startTime()));
    }

    apply<T>(state: T) {
        return state;
    }
}
