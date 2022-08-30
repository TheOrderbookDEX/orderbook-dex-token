import { AddContextFunction, BaseTestContext, now, TestScenario, TestScenarioProperties } from '@theorderbookdex/contract-test-helper';
import { OrderbookDEXToken } from '../../src/OrderbookDEXToken';
import { ExchangeRate, OrderbookDEXPreSale } from '../../src/OrderbookDEXPreSale';
import { formatExchangeRate, formatTimeOffset } from '../utils/format';
import { predictContractAddress } from '../utils/ethereum';
import { ONE_HOUR } from '../utils/timestamp';
import { parseValue } from '@theorderbookdex/abi2ts-lib';

export interface PreSaleContext extends BaseTestContext {
    readonly token: OrderbookDEXToken;
    readonly preSale: OrderbookDEXPreSale;
}

export interface PreSaleScenarioProperties<TestContext extends PreSaleContext>
    extends TestScenarioProperties<TestContext>
{
    readonly startTimeOffset?: bigint;
    readonly endTimeOffset?: bigint;
    readonly releaseTimeOffset?: bigint;
    readonly exchangeRate: Readonly<ExchangeRate>;
}

export abstract class PreSaleScenario<TestContext extends PreSaleContext, ExecuteResult, ExecuteStaticResult>
    extends TestScenario<TestContext, ExecuteResult, ExecuteStaticResult>
{
    static readonly DEFAULT_START_TIME_OFFSET = 0n;
    static readonly DEFAULT_END_TIME_OFFSET = ONE_HOUR;
    static readonly DEFAULT_RELEASE_TIME_OFFSET = ONE_HOUR;
    static readonly DEFAULT_AVAILABLE_AT_RELEASE = parseValue(1);
    static readonly DEFAULT_VESTING_PERIOD = ONE_HOUR;
    static readonly DEFAULT_VESTED_AMOUNT_PER_PERIOD = parseValue(1);

    readonly startTimeOffset: bigint;
    readonly endTimeOffset: bigint;
    readonly releaseTimeOffset: bigint;
    readonly exchangeRate: Readonly<ExchangeRate>;
    readonly availableAtRelease: bigint;
    readonly vestingPeriod: bigint;
    readonly vestedAmountPerPeriod: bigint;

    constructor({
        startTimeOffset   = PreSaleScenario.DEFAULT_START_TIME_OFFSET,
        endTimeOffset     = PreSaleScenario.DEFAULT_END_TIME_OFFSET,
        releaseTimeOffset = PreSaleScenario.DEFAULT_RELEASE_TIME_OFFSET,
        exchangeRate,
        ...rest
    }: PreSaleScenarioProperties<TestContext>) {
        super(rest);
        this.startTimeOffset       = startTimeOffset;
        this.endTimeOffset         = endTimeOffset;
        this.releaseTimeOffset     = releaseTimeOffset;
        this.exchangeRate          = exchangeRate;
        // TODO allow changing these deploy properties
        this.availableAtRelease    = PreSaleScenario.DEFAULT_AVAILABLE_AT_RELEASE;
        this.vestingPeriod         = PreSaleScenario.DEFAULT_VESTING_PERIOD;
        this.vestedAmountPerPeriod = PreSaleScenario.DEFAULT_VESTED_AMOUNT_PER_PERIOD;
    }

    addContext(addContext: AddContextFunction): void {
        if (this.startTimeOffset != PreSaleScenario.DEFAULT_START_TIME_OFFSET) {
            addContext('start time', formatTimeOffset(this.startTimeOffset));
        }
        if (this.endTimeOffset != PreSaleScenario.DEFAULT_END_TIME_OFFSET) {
            addContext('end time', formatTimeOffset(this.endTimeOffset, 'start'));
        }
        if (this.releaseTimeOffset != PreSaleScenario.DEFAULT_RELEASE_TIME_OFFSET) {
            addContext('release time', formatTimeOffset(this.releaseTimeOffset, 'end'));
        }
        addContext('exchange rate', formatExchangeRate(this.exchangeRate));
        super.addContext(addContext);
    }

    protected async _setup(): Promise<PreSaleContext> {
        const ctx = await super._setup();
        const startTime = now() + this.startTimeOffset;
        const endTime = startTime + this.endTimeOffset;
        const releaseTime = endTime + this.releaseTimeOffset;
        const treasury = '0x1000000000000000000000000000000000000001';
        const seed = '0x1000000000000000000000000000000000000002';
        const publicSale = '0x1000000000000000000000000000000000000003';
        const preSaleAddress = await predictContractAddress(1);
        const token = await OrderbookDEXToken.deploy(treasury, seed, preSaleAddress, publicSale);
        const { exchangeRate, availableAtRelease, vestingPeriod, vestedAmountPerPeriod } = this;
        const preSale = await OrderbookDEXPreSale.deploy(token, treasury, startTime, endTime, releaseTime, exchangeRate, availableAtRelease, vestingPeriod, vestedAmountPerPeriod);
        return { ...ctx, token, preSale };
    }
}
