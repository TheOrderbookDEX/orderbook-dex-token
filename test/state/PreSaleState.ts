import { Account } from '@theorderbookdex/contract-test-helper';
import { ETHER } from '../utils/eth-units';
import { min } from '../utils/math';

export enum PreSaleStage {
    DEPLOY,
    START,
    EARLY_END,
    END,
    RELEASE,
    VESTING,
}

interface PreSaleStateProperties {
    readonly tokensForSale: bigint;
    readonly exchangeRate: bigint;
    readonly availableAtRelease: bigint;
    readonly vestedAmountPerPeriod: bigint;
    readonly buyLimit: bigint;
    readonly successThreshold: bigint;
    readonly earlyExchangeRate: bigint;
    readonly earlyLimit: bigint;
    readonly stage?: PreSaleStage;
    readonly currentVestingPeriod?: number;
    readonly totalSold?: bigint;
    readonly amountSold?: ReadonlyMap<Account, bigint>;
    readonly totalPaid?: bigint;
    readonly amountPaid?: ReadonlyMap<Account, bigint>;
    readonly amountClaimed?: ReadonlyMap<Account, bigint>;
}

export class PreSaleState implements Required<PreSaleStateProperties> {
    readonly tokensForSale: bigint;
    readonly exchangeRate: bigint;
    readonly availableAtRelease: bigint;
    readonly vestedAmountPerPeriod: bigint;
    readonly buyLimit: bigint;
    readonly successThreshold: bigint;
    readonly earlyExchangeRate: bigint;
    readonly earlyLimit: bigint;
    readonly stage: PreSaleStage;
    readonly currentVestingPeriod: number;
    readonly totalSold: bigint;
    readonly amountSold: ReadonlyMap<Account, bigint>;
    readonly totalPaid: bigint;
    readonly amountPaid: ReadonlyMap<Account, bigint>;
    readonly amountClaimed: ReadonlyMap<Account, bigint>;

    constructor({
        tokensForSale,
        exchangeRate,
        availableAtRelease,
        vestedAmountPerPeriod,
        buyLimit,
        successThreshold,
        earlyExchangeRate,
        earlyLimit,
        stage = PreSaleStage.DEPLOY,
        currentVestingPeriod: vestingPeriod = 0,
        totalSold = 0n,
        amountSold = new Map,
        totalPaid = 0n,
        amountPaid = new Map,
        amountClaimed = new Map,
    }: PreSaleStateProperties) {
        this.tokensForSale = tokensForSale;
        this.exchangeRate = exchangeRate;
        this.availableAtRelease = availableAtRelease;
        this.vestedAmountPerPeriod = vestedAmountPerPeriod;
        this.buyLimit = buyLimit;
        this.successThreshold = successThreshold;
        this.earlyExchangeRate = earlyExchangeRate;
        this.earlyLimit = earlyLimit;
        this.stage = stage;
        this.currentVestingPeriod = vestingPeriod;
        this.totalSold = totalSold;
        this.amountSold = amountSold;
        this.totalPaid = totalPaid;
        this.amountPaid = amountPaid;
        this.amountClaimed = amountClaimed;
    }

    fastForwardTo(stage: PreSaleStage): PreSaleState;
    fastForwardTo(stage: PreSaleStage.VESTING, vestingPeriod: number): PreSaleState
    fastForwardTo(stage: PreSaleStage, currentVestingPeriod = 0): PreSaleState {
        if (this.stage > stage) {
            throw new Error('fast forward to previous stage');
        }
        if (this.currentVestingPeriod > currentVestingPeriod) {
            throw new Error('fast forward to previous vesting period');
        }
        return new PreSaleState({
            ...this,
            stage,
            currentVestingPeriod,
        });
    }

    buy(account: Account, value: bigint): PreSaleState {
        if (this.stage < PreSaleStage.START) {
            throw new Error('not started');
        }

        if (this.stage >= PreSaleStage.END) {
            throw new Error('ended');
        }

        const [ bought, paid ] = this.calculateBoughtTokens(account, value);
        if (!bought) {
            throw new Error('sold out');
        }

        const totalSold = this.totalSold + bought;
        const amountSold = new Map(this.amountSold);
        amountSold.set(account, amountSold.get(account) ?? 0n + bought);
        const totalPaid = this.totalPaid + paid;
        const amountPaid = new Map(this.amountPaid);
        amountPaid.set(account, amountPaid.get(account) ?? 0n + paid);

        return new PreSaleState({
            ...this,
            totalSold,
            amountSold,
            totalPaid,
            amountPaid,
        });
    }

    calculateBoughtTokens(account: Account, value: bigint): [ bought: bigint, paid: bigint ] {
        const available = min(this.tokensForSale - this.totalSold, this.buyLimit - (this.amountSold.get(account) ?? 0n));
        const [ boughtEarly, paidEarly ] = this.calculateBoughtTokensEarly(value, available);
        const [ boughtLate, paidLate ] = calculateBoughtTokens(value - paidEarly, this.exchangeRate, available - boughtEarly);
        const bought = boughtEarly + boughtLate;
        const paid = paidEarly + paidLate;
        return [ bought, paid ];
    }

    private calculateBoughtTokensEarly(value: bigint, available: bigint): [ bought: bigint, paid: bigint ] {
        if (this.stage < PreSaleStage.EARLY_END) {
            const earlyAvailable = this.earlyLimit - this.totalSold;
            if (earlyAvailable > 0n) {
                return calculateBoughtTokens(value, this.earlyExchangeRate, min(earlyAvailable, available));
            }
        }
        return [ 0n, 0n ];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    claim(account: Account): PreSaleState {
        if (this.stage < PreSaleStage.RELEASE) {
            throw new Error('not released');
        }

        if (this.totalSold < this.successThreshold) {
            throw new Error('not successful');
        }

        // TODO PreSaleState claim

        return this;
    }

    cancel(account: Account): PreSaleState {
        if (this.stage >= PreSaleStage.END) {
            if (this.totalSold >= this.successThreshold) {
                throw new Error('ended');
            }
        }

        if (!this.amountSold.get(account)) {
            throw new Error('nothing to cancel');
        }

        const totalSold = this.totalSold - (this.amountSold.get(account) ?? 0n);
        const amountSold = new Map(this.amountSold);
        amountSold.delete(account);
        const totalPaid = this.totalPaid - (this.amountPaid.get(account) ?? 0n);
        const amountPaid = new Map(this.amountPaid);
        amountPaid.delete(account);

        return new PreSaleState({
            ...this,
            totalSold,
            amountSold,
            totalPaid,
            amountPaid,
        });
    }

    withdraw(): PreSaleState {
        if (this.stage < PreSaleStage.END) {
            throw new Error('not ended');
        }

        if (this.totalSold < this.successThreshold) {
            throw new Error('not successful');
        }

        // TODO PreSaleState withdraw

        return this;
    }
}

function calculateBoughtTokens(value: bigint, rate: bigint, limit: bigint): [ bought: bigint, paid: bigint ] {
    const bought = min(value * rate / ETHER, limit);
    const paid = bought * ETHER / rate;
    return [ bought, paid ];
}
