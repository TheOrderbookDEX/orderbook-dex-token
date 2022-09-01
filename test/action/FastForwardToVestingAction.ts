import { setChainTime } from '@theorderbookdex/contract-test-helper';
import { PreSaleContext } from '../scenario/PreSaleScenario';
import { PreSaleAction, PreSaleActionProperties } from './PreSaleAction';

export interface FastForwardToVestingActionProperties extends PreSaleActionProperties {
    readonly period?: number;
}

export class FastForwardToVestingAction extends PreSaleAction {
    readonly period: number;

    constructor({ period = 1, ...rest }: FastForwardToVestingActionProperties) {
        super(rest);
        this.period = period;
    }

    async execute({ preSale }: PreSaleContext) {
        const releaseTime = Number(await preSale.releaseTime());
        const vestingPeriod = Number(await preSale.vestingPeriod());
        await setChainTime(releaseTime + vestingPeriod * this.period);
    }

    apply<T>(state: T) {
        return state;
    }
}
