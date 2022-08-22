import { formatValue } from '@theorderbookdex/abi2ts-lib';
import { ConfigurableDescriber } from '@theorderbookdex/contract-test-helper';
import { BuyPreSaleScenario } from '../scenario/BuyPreSaleScenario';
import { DeployPreSaleScenario } from '../scenario/DeployPreSaleScenario';
import { formatExchangeRate, formatTimeOffset } from '../utils/format';

export const describer = new ConfigurableDescriber<void>();

describer.addDescriber(DeployPreSaleScenario, ({
    token, treasury, startTimeOffset, endTimeOffset, releaseTimeOffset, exchangeRate
}) => {
    const settings = [];
    if (token != DeployPreSaleScenario.DEFAULT_TOKEN) {
        settings.push(`token = ${token}`);
    }
    if (treasury != DeployPreSaleScenario.DEFAULT_TREASURY) {
        settings.push(`treasury = ${treasury}`);
    }
    if (startTimeOffset != DeployPreSaleScenario.DEFAULT_START_TIME_OFFSET) {
        settings.push(`startTime = ${formatTimeOffset(startTimeOffset)}`);
    }
    if (endTimeOffset != DeployPreSaleScenario.DEFAULT_END_TIME_OFFSET) {
        settings.push(`endTime = ${formatTimeOffset(endTimeOffset, 'start')}`);
    }
    if (releaseTimeOffset != DeployPreSaleScenario.DEFAULT_RELEASE_TIME_OFFSET) {
        settings.push(`releaseTime = ${formatTimeOffset(releaseTimeOffset, 'end')}`);
    }
    settings.push(`exchangeRate = ${formatExchangeRate(exchangeRate)}`);
    return `deploy with ${settings.join(' and ')}`;
});

describer.addDescriber(BuyPreSaleScenario, ({
    value, startTimeOffset, endTimeOffset, releaseTimeOffset, exchangeRate
}) => {
    const settings = [];
    if (startTimeOffset != BuyPreSaleScenario.DEFAULT_START_TIME_OFFSET) {
        settings.push(`startTime = ${formatTimeOffset(startTimeOffset)}`);
    }
    if (endTimeOffset != BuyPreSaleScenario.DEFAULT_END_TIME_OFFSET) {
        settings.push(`endTime = ${formatTimeOffset(endTimeOffset, 'start')}`);
    }
    if (releaseTimeOffset != BuyPreSaleScenario.DEFAULT_RELEASE_TIME_OFFSET) {
        settings.push(`releaseTime = ${formatTimeOffset(releaseTimeOffset, 'end')}`);
    }
    settings.push(`exchangeRate = ${formatExchangeRate(exchangeRate)}`);
    return `buy using ${formatValue(value)} ETH with ${settings.join(' and ')}`;
});
