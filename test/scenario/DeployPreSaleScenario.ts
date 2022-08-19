import { AddContextFunction, BaseTestContext, now, TestScenario, TestScenarioProperties } from '@theorderbookdex/contract-test-helper';
import { ExchangeRate, OrderbookDEXPreSale } from '../../src/OrderbookDEXPreSale';
import { formatExchangeRate, formatTimeOffset } from '../utils/utils';

export interface DeployPreSaleContext extends BaseTestContext {
    readonly startTime: bigint;
    readonly endTime: bigint;
    readonly releaseTime: bigint;
}

export interface DeployPreSaleScenarioProperties extends TestScenarioProperties<DeployPreSaleContext> {
    readonly token: string;
    readonly treasury: string;
    readonly startTimeOffset: bigint;
    readonly endTimeOffset: bigint;
    readonly releaseTimeOffset: bigint;
    readonly exchangeRate: Readonly<ExchangeRate>;
}

export class DeployPreSaleScenario extends TestScenario<DeployPreSaleContext, OrderbookDEXPreSale, string> {
    readonly token: string;
    readonly treasury: string;
    readonly startTimeOffset: bigint;
    readonly endTimeOffset: bigint;
    readonly releaseTimeOffset: bigint;
    readonly exchangeRate: Readonly<ExchangeRate>;

    constructor({
        token,
        treasury,
        startTimeOffset,
        endTimeOffset,
        releaseTimeOffset,
        exchangeRate,
        ...rest
    }: DeployPreSaleScenarioProperties) {
        super(rest);
        this.token = token;
        this.treasury = treasury;
        this.startTimeOffset = startTimeOffset;
        this.endTimeOffset = endTimeOffset;
        this.releaseTimeOffset = releaseTimeOffset;
        this.exchangeRate = exchangeRate;
    }

    addContext(addContext: AddContextFunction): void {
        addContext('token address', this.token);
        addContext('treasury address', this.treasury);
        addContext('start time', formatTimeOffset(this.startTimeOffset));
        addContext('end time', formatTimeOffset(this.endTimeOffset));
        addContext('release time', formatTimeOffset(this.releaseTimeOffset));
        addContext('exchange rate', formatExchangeRate(this.exchangeRate));
        super.addContext(addContext);
    }

    protected async _setup(): Promise<DeployPreSaleContext> {
        const ctx = await super._setup();
        const currentTime = now();
        const startTime = currentTime + this.startTimeOffset;
        const endTime = currentTime + this.endTimeOffset;
        const releaseTime = currentTime + this.releaseTimeOffset;
        return { ...ctx, startTime, endTime, releaseTime };
    }

    async setup() {
        return await this._setup();
    }

    async execute({ startTime, endTime, releaseTime }: DeployPreSaleContext) {
        const { token, treasury, exchangeRate } = this;
        return await OrderbookDEXPreSale.deploy(token, treasury, startTime, endTime, releaseTime, exchangeRate);
    }

    async executeStatic({ startTime, endTime, releaseTime }: DeployPreSaleContext) {
        const { token, treasury, exchangeRate } = this;
        return await OrderbookDEXPreSale.callStatic.deploy(token, treasury, startTime, endTime, releaseTime, exchangeRate);
    }
}
