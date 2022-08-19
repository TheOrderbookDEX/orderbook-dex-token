import { ConfigurableDescriber } from '@theorderbookdex/contract-test-helper';
import { DeployPreSaleScenario } from '../scenario/DeployPreSaleScenario';
import { formatExchangeRate, formatTimeOffset } from '../utils/utils';

export const describer = new ConfigurableDescriber<void>();

describer.addDescriber(DeployPreSaleScenario, ({
    token, treasury, startTimeOffset, endTimeOffset, releaseTimeOffset, exchangeRate
}) => {
    const settings = [];
    settings.push(`token at ${token}`);
    settings.push(`treasury at ${treasury}`);
    settings.push(`startTime at ${formatTimeOffset(startTimeOffset)}`);
    settings.push(`endTime at ${formatTimeOffset(endTimeOffset)}`);
    settings.push(`releaseTime at ${formatTimeOffset(releaseTimeOffset)}`);
    settings.push(`exchangeRate at ${formatExchangeRate(exchangeRate)}`);
    return `deploy${ settings.length ? ` with ${ settings.join(' and ') }` : '' }`;
});
