import { formatValue, MAX_UINT256, parseValue } from '@frugal-wizard/abi2ts-lib';
import { AddContextFunction, BaseTestContext, now, TestScenario, TestScenarioProperties } from '@frugal-wizard/contract-test-helper';
import { OrderbookDEXPreSale } from '../../src/OrderbookDEXPreSale';
import { formatExchangeRate, formatTimeOffset, formatTimePeriod } from '../utils/format';
import { ONE_HOUR } from '../utils/timestamp';

export interface DeployPreSaleContext extends BaseTestContext {
    readonly startTime: bigint;
    readonly endTime: bigint;
    readonly releaseTime: bigint;
    readonly earlyEndTime: bigint;
}

export interface DeployPreSaleScenarioProperties extends TestScenarioProperties<DeployPreSaleContext> {
    readonly token?: string;
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

export class DeployPreSaleScenario extends TestScenario<DeployPreSaleContext, OrderbookDEXPreSale, string> {
    static readonly DEFAULT_TOKEN = '0x1000000000000000000000000000000000000001';
    static readonly DEFAULT_TREASURY = '0x1000000000000000000000000000000000000002';
    static readonly DEFAULT_START_TIME_OFFSET = ONE_HOUR;
    static readonly DEFAULT_END_TIME_OFFSET = ONE_HOUR;
    static readonly DEFAULT_RELEASE_TIME_OFFSET = ONE_HOUR;
    static readonly DEFAULT_EXCHANGE_RATE = parseValue(1);
    static readonly DEFAULT_AVAILABLE_AT_RELEASE = 0n;
    static readonly DEFAULT_VESTING_PERIOD = ONE_HOUR;
    static readonly DEFAULT_VESTED_AMOUNT_PER_PERIOD = parseValue(1);
    static readonly DEFAULT_BUY_LIMIT = MAX_UINT256;
    static readonly DEFAULT_SUCCESS_THRESHOLD = 0n;
    static readonly DEFAULT_EARLY_EXCHANGE_RATE = parseValue(2);
    static readonly DEFAULT_EARLY_END_TIME_OFFSET = ONE_HOUR;
    static readonly DEFAULT_EARLY_LIMIT = 0n;

    readonly token: string;
    readonly treasury: string;
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
        token                 = DeployPreSaleScenario.DEFAULT_TOKEN,
        treasury              = DeployPreSaleScenario.DEFAULT_TREASURY,
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
    }: DeployPreSaleScenarioProperties) {
        super(rest);
        this.token                 = token;
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
        addContext('token address', this.token);
        addContext('treasury address', this.treasury);
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

    protected async _setup(): Promise<DeployPreSaleContext> {
        const ctx = await super._setup();
        const startTime = now() + this.startTimeOffset;
        const earlyEndTime = startTime + this.earlyEndTimeOffset;
        const endTime = earlyEndTime + this.endTimeOffset;
        const releaseTime = endTime + this.releaseTimeOffset;
        return { ...ctx, startTime, endTime, releaseTime, earlyEndTime };
    }

    async setup() {
        return await this._setup();
    }

    async execute({ startTime, endTime, releaseTime, earlyEndTime }: DeployPreSaleContext) {
        const {
            token, treasury, exchangeRate, availableAtRelease, vestingPeriod, vestedAmountPerPeriod,
            buyLimit, successThreshold, earlyExchangeRate, earlyLimit
        } = this;
        return await OrderbookDEXPreSale.deploy(
            token, treasury, startTime, endTime, releaseTime, exchangeRate, availableAtRelease,
            vestingPeriod, vestedAmountPerPeriod, buyLimit, successThreshold, earlyExchangeRate,
            earlyEndTime, earlyLimit
        );
    }

    async executeStatic({ startTime, endTime, releaseTime, earlyEndTime }: DeployPreSaleContext) {
        const {
            token, treasury, exchangeRate, availableAtRelease, vestingPeriod, vestedAmountPerPeriod,
            buyLimit, successThreshold, earlyExchangeRate, earlyLimit
        } = this;
        return await OrderbookDEXPreSale.callStatic.deploy(
            token, treasury, startTime, endTime, releaseTime, exchangeRate, availableAtRelease,
            vestingPeriod, vestedAmountPerPeriod, buyLimit, successThreshold, earlyExchangeRate,
            earlyEndTime, earlyLimit
        );
    }
}
