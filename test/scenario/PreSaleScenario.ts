import { AddContextFunction, applySetupActions, BaseTestContext, now, TestScenario, TestScenarioProperties } from '@frugal-wizard/contract-test-helper';
import { OrderbookDEXToken } from '../../src/OrderbookDEXToken';
import { OrderbookDEXPreSale } from '../../src/OrderbookDEXPreSale';
import { formatExchangeRate, formatTimeOffset, formatTimePeriod } from '../utils/format';
import { formatValue, predictContractAddress } from '@frugal-wizard/abi2ts-lib';
import { DeployPreSaleScenario } from './DeployPreSaleScenario';
import { PreSaleState } from '../state/PreSaleState';
import { PRE_SALE_TOKENS } from '../utils/tokenomics';

export interface PreSaleContext extends BaseTestContext {
    readonly token: OrderbookDEXToken;
    readonly preSale: OrderbookDEXPreSale;
}

export interface PreSaleScenarioProperties<TestContext extends PreSaleContext>
    extends TestScenarioProperties<TestContext>
{
    readonly treasury?: string;
    readonly startTimeOffset?: bigint;
    readonly endTimeOffset?: bigint;
    readonly releaseTimeOffset?: bigint;
    readonly exchangeRate?: bigint;
    readonly availableAtRelease?: bigint;
    readonly vestingPeriod?: bigint;
    readonly vestedAmountPerPeriod?: bigint;
    readonly buyLimit?: bigint;
    readonly successThreshold?: bigint;
    readonly earlyExchangeRate?: bigint;
    readonly earlyEndTimeOffset?: bigint;
    readonly earlyLimit?: bigint;
}

export abstract class PreSaleScenario<TestContext extends PreSaleContext, ExecuteResult, ExecuteStaticResult>
    extends TestScenario<TestContext, ExecuteResult, ExecuteStaticResult>
{
    readonly treasury?: string;
    readonly startTimeOffset: bigint;
    readonly endTimeOffset: bigint;
    readonly releaseTimeOffset: bigint;
    readonly exchangeRate: bigint;
    readonly availableAtRelease: bigint;
    readonly vestingPeriod: bigint;
    readonly vestedAmountPerPeriod: bigint;
    readonly buyLimit: bigint;
    readonly successThreshold: bigint;
    readonly earlyExchangeRate: bigint;
    readonly earlyEndTimeOffset: bigint;
    readonly earlyLimit: bigint;

    constructor({
        treasury,
        startTimeOffset       = DeployPreSaleScenario.DEFAULT_START_TIME_OFFSET,
        endTimeOffset         = DeployPreSaleScenario.DEFAULT_END_TIME_OFFSET,
        releaseTimeOffset     = DeployPreSaleScenario.DEFAULT_RELEASE_TIME_OFFSET,
        exchangeRate          = DeployPreSaleScenario.DEFAULT_EXCHANGE_RATE,
        availableAtRelease    = DeployPreSaleScenario.DEFAULT_AVAILABLE_AT_RELEASE,
        vestingPeriod         = DeployPreSaleScenario.DEFAULT_VESTING_PERIOD,
        vestedAmountPerPeriod = DeployPreSaleScenario.DEFAULT_VESTED_AMOUNT_PER_PERIOD,
        buyLimit              = DeployPreSaleScenario.DEFAULT_BUY_LIMIT,
        successThreshold      = DeployPreSaleScenario.DEFAULT_SUCCESS_THRESHOLD,
        earlyExchangeRate     = DeployPreSaleScenario.DEFAULT_EARLY_EXCHANGE_RATE,
        earlyEndTimeOffset    = DeployPreSaleScenario.DEFAULT_EARLY_END_TIME_OFFSET,
        earlyLimit            = DeployPreSaleScenario.DEFAULT_EARLY_LIMIT,
        ...rest
    }: PreSaleScenarioProperties<TestContext>) {
        super(rest);
        this.treasury              = treasury;
        this.startTimeOffset       = startTimeOffset;
        this.endTimeOffset         = endTimeOffset;
        this.releaseTimeOffset     = releaseTimeOffset;
        this.exchangeRate          = exchangeRate;
        this.availableAtRelease    = availableAtRelease;
        this.vestingPeriod         = vestingPeriod;
        this.vestedAmountPerPeriod = vestedAmountPerPeriod;
        this.buyLimit              = buyLimit;
        this.successThreshold      = successThreshold;
        this.earlyExchangeRate     = earlyExchangeRate;
        this.earlyEndTimeOffset    = earlyEndTimeOffset;
        this.earlyLimit            = earlyLimit;
    }

    addContext(addContext: AddContextFunction): void {
        if (this.treasury) {
            addContext('treasury address', this.treasury);
        }
        addContext('start time', formatTimeOffset(this.startTimeOffset));
        addContext('end time', formatTimeOffset(this.endTimeOffset, 'earlyEndTime'));
        addContext('release time', formatTimeOffset(this.releaseTimeOffset, 'endTime'));
        addContext('exchange rate', formatExchangeRate(this.exchangeRate));
        addContext('available at release', formatValue(this.availableAtRelease));
        addContext('vesting period', formatTimePeriod(this.vestingPeriod));
        addContext('vested amount per period', formatValue(this.vestedAmountPerPeriod));
        addContext('buy limit', formatValue(this.buyLimit));
        addContext('success threshold', formatValue(this.successThreshold));
        addContext('early exchange rate', formatValue(this.earlyExchangeRate));
        addContext('early end time', formatTimeOffset(this.earlyEndTimeOffset, 'startTime'));
        addContext('early limit', formatValue(this.earlyLimit));
        super.addContext(addContext);
    }

    protected async _setup(): Promise<PreSaleContext> {
        const ctx = await super._setup();
        const startTime = now() + this.startTimeOffset;
        const earlyEndTime = startTime + this.earlyEndTimeOffset;
        const endTime = earlyEndTime + this.endTimeOffset;
        const releaseTime = endTime + this.releaseTimeOffset;
        const treasury = this.treasury ?? ctx.mainAccount;
        const seed = '0x1000000000000000000000000000000000000002';
        const publicSale = '0x1000000000000000000000000000000000000003';
        const preSaleAddress = await predictContractAddress(ctx.mainAccount, 1);
        const token = await OrderbookDEXToken.deploy(treasury, seed, preSaleAddress, publicSale);
        const {
            exchangeRate, availableAtRelease, vestingPeriod, vestedAmountPerPeriod, buyLimit,
            successThreshold, earlyExchangeRate, earlyLimit
        } = this;
        const preSale = await OrderbookDEXPreSale.deploy(
            token, treasury, startTime, endTime, releaseTime, exchangeRate, availableAtRelease,
            vestingPeriod, vestedAmountPerPeriod, buyLimit, successThreshold, earlyExchangeRate,
            earlyEndTime, earlyLimit
        );
        return { ...ctx, token, preSale };
    }

    get stateBefore(): PreSaleState {
        return applySetupActions(this.setupActions, new PreSaleState({
            ...this,
            tokensForSale: PRE_SALE_TOKENS,
        }));
    }
}
