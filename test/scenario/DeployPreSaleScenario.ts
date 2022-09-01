import { formatValue, parseValue } from '@theorderbookdex/abi2ts-lib';
import { AddContextFunction, BaseTestContext, now, TestScenario, TestScenarioProperties } from '@theorderbookdex/contract-test-helper';
import { ExchangeRate, OrderbookDEXPreSale } from '../../src/OrderbookDEXPreSale';
import { formatExchangeRate, formatTimeOffset, formatTimePeriod } from '../utils/format';
import { ONE_HOUR } from '../utils/timestamp';

export interface DeployPreSaleContext extends BaseTestContext {
    readonly startTime: bigint;
    readonly endTime: bigint;
    readonly releaseTime: bigint;
}

export interface DeployPreSaleScenarioProperties extends TestScenarioProperties<DeployPreSaleContext> {
    readonly token?: string;
    readonly treasury?: string;
    readonly startTimeOffset?: bigint;
    readonly endTimeOffset?: bigint;
    readonly releaseTimeOffset?: bigint;
    readonly exchangeRate?: Readonly<ExchangeRate>;
    readonly availableAtRelease?: bigint;
    readonly vestingPeriod?: bigint;
    readonly vestedAmountPerPeriod?: bigint;
}

export class DeployPreSaleScenario extends TestScenario<DeployPreSaleContext, OrderbookDEXPreSale, string> {
    static readonly DEFAULT_TOKEN = '0x1000000000000000000000000000000000000001';
    static readonly DEFAULT_TREASURY = '0x1000000000000000000000000000000000000002';
    static readonly DEFAULT_START_TIME_OFFSET = 0n;
    static readonly DEFAULT_END_TIME_OFFSET = ONE_HOUR;
    static readonly DEFAULT_RELEASE_TIME_OFFSET = ONE_HOUR;
    static readonly DEFAULT_EXCHANGE_RATE: Readonly<ExchangeRate> = new ExchangeRate(1n, 1n);
    static readonly DEFAULT_AVAILABLE_AT_RELEASE = 0n;
    static readonly DEFAULT_VESTING_PERIOD = ONE_HOUR;
    static readonly DEFAULT_VESTED_AMOUNT_PER_PERIOD = parseValue(1);

    readonly token: string;
    readonly treasury: string;
    readonly startTimeOffset: bigint;
    readonly endTimeOffset: bigint;
    readonly releaseTimeOffset: bigint;
    readonly exchangeRate: Readonly<ExchangeRate>;
    readonly availableAtRelease: bigint;
    readonly vestingPeriod: bigint;
    readonly vestedAmountPerPeriod: bigint;

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
    }

    addContext(addContext: AddContextFunction): void {
        addContext('token address', this.token);
        addContext('treasury address', this.treasury);
        addContext('start time', formatTimeOffset(this.startTimeOffset));
        addContext('end time', formatTimeOffset(this.endTimeOffset, 'startTime'));
        addContext('release time', formatTimeOffset(this.releaseTimeOffset, 'endTime'));
        addContext('exchange rate', formatExchangeRate(this.exchangeRate));
        addContext('available at release', formatValue(this.availableAtRelease));
        addContext('vesting period', formatTimePeriod(this.vestingPeriod));
        addContext('vested amount per period', formatValue(this.vestedAmountPerPeriod));
        super.addContext(addContext);
    }

    protected async _setup(): Promise<DeployPreSaleContext> {
        const ctx = await super._setup();
        const startTime = now() + this.startTimeOffset;
        const endTime = startTime + this.endTimeOffset;
        const releaseTime = endTime + this.releaseTimeOffset;
        return { ...ctx, startTime, endTime, releaseTime };
    }

    async setup() {
        return await this._setup();
    }

    async execute({ startTime, endTime, releaseTime }: DeployPreSaleContext) {
        const { token, treasury, exchangeRate, availableAtRelease, vestingPeriod, vestedAmountPerPeriod } = this;
        return await OrderbookDEXPreSale.deploy(token, treasury, startTime, endTime, releaseTime, exchangeRate, availableAtRelease, vestingPeriod, vestedAmountPerPeriod);
    }

    async executeStatic({ startTime, endTime, releaseTime }: DeployPreSaleContext) {
        const { token, treasury, exchangeRate, availableAtRelease, vestingPeriod, vestedAmountPerPeriod } = this;
        return await OrderbookDEXPreSale.callStatic.deploy(token, treasury, startTime, endTime, releaseTime, exchangeRate, availableAtRelease, vestingPeriod, vestedAmountPerPeriod);
    }
}
