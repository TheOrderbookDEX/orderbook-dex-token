import { AddContextFunction, BaseTestContext, now, TestScenario, TestScenarioProperties } from '@theorderbookdex/contract-test-helper';
import { OrderbookDEXToken } from '../../src/OrderbookDEXToken';
import { ExchangeRate, OrderbookDEXPreSale } from '../../src/OrderbookDEXPreSale';
import { formatExchangeRate, formatTimeOffset, formatTimePeriod } from '../utils/format';
import { predictContractAddress } from '../utils/ethereum';
import { formatValue } from '@theorderbookdex/abi2ts-lib';
import { DeployPreSaleScenario } from './DeployPreSaleScenario';

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
    readonly exchangeRate?: Readonly<ExchangeRate>;
    readonly availableAtRelease?: bigint;
    readonly vestingPeriod?: bigint;
    readonly vestedAmountPerPeriod?: bigint;
}

export abstract class PreSaleScenario<TestContext extends PreSaleContext, ExecuteResult, ExecuteStaticResult>
    extends TestScenario<TestContext, ExecuteResult, ExecuteStaticResult>
{
    readonly startTimeOffset: bigint;
    readonly endTimeOffset: bigint;
    readonly releaseTimeOffset: bigint;
    readonly exchangeRate: Readonly<ExchangeRate>;
    readonly availableAtRelease: bigint;
    readonly vestingPeriod: bigint;
    readonly vestedAmountPerPeriod: bigint;

    constructor({
        startTimeOffset       = DeployPreSaleScenario.DEFAULT_START_TIME_OFFSET,
        endTimeOffset         = DeployPreSaleScenario.DEFAULT_END_TIME_OFFSET,
        releaseTimeOffset     = DeployPreSaleScenario.DEFAULT_RELEASE_TIME_OFFSET,
        exchangeRate          = DeployPreSaleScenario.DEFAULT_EXCHANGE_RATE,
        availableAtRelease    = DeployPreSaleScenario.DEFAULT_AVAILABLE_AT_RELEASE,
        vestingPeriod         = DeployPreSaleScenario.DEFAULT_VESTING_PERIOD,
        vestedAmountPerPeriod = DeployPreSaleScenario.DEFAULT_VESTED_AMOUNT_PER_PERIOD,
        ...rest
    }: PreSaleScenarioProperties<TestContext>) {
        super(rest);
        this.startTimeOffset       = startTimeOffset;
        this.endTimeOffset         = endTimeOffset;
        this.releaseTimeOffset     = releaseTimeOffset;
        this.exchangeRate          = exchangeRate;
        this.availableAtRelease    = availableAtRelease;
        this.vestingPeriod         = vestingPeriod;
        this.vestedAmountPerPeriod = vestedAmountPerPeriod;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('start time', formatTimeOffset(this.startTimeOffset));
        addContext('end time', formatTimeOffset(this.endTimeOffset, 'start'));
        addContext('release time', formatTimeOffset(this.releaseTimeOffset, 'end'));
        addContext('exchange rate', formatExchangeRate(this.exchangeRate));
        addContext('available at release', formatValue(this.availableAtRelease));
        addContext('vesting period', formatTimePeriod(this.vestingPeriod));
        addContext('vested amount per period', formatValue(this.vestedAmountPerPeriod));
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
