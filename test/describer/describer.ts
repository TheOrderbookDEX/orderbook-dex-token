import { formatValue } from '@theorderbookdex/abi2ts-lib';
import { ConfigurableDescriber } from '@theorderbookdex/contract-test-helper';
import { BuyPreSaleAction } from '../action/BuyPreSaleAction';
import { ClaimPreSaleAction } from '../action/ClaimPreSaleAction';
import { FastForwardToEndAction } from '../action/FastForwardToEndAction';
import { FastForwardToReleaseAction } from '../action/FastForwardToReleaseAction';
import { FastForwardToStartAction } from '../action/FastForwardToStartAction';
import { FastForwardToVestingAction } from '../action/FastForwardToVestingAction';
import { BuyPreSaleScenario } from '../scenario/BuyPreSaleScenario';
import { ClaimPreSaleScenario } from '../scenario/ClaimPreSaleScenario';
import { DeployPreSaleScenario } from '../scenario/DeployPreSaleScenario';
import { formatExchangeRate, formatTimeOffset, formatTimePeriod } from '../utils/format';

export const describer = new ConfigurableDescriber<void>();

function describePreSaleSettings({
    token, treasury, startTimeOffset, endTimeOffset, releaseTimeOffset, exchangeRate, availableAtRelease, vestingPeriod, vestedAmountPerPeriod, buyLimit
}: {
    token?: string,
    treasury?: string,
    startTimeOffset: bigint,
    endTimeOffset: bigint,
    releaseTimeOffset: bigint,
    exchangeRate: bigint,
    availableAtRelease: bigint,
    vestingPeriod: bigint,
    vestedAmountPerPeriod: bigint,
    buyLimit: bigint
}): string[] {
    const description: string[] = [];
    if (token && token != DeployPreSaleScenario.DEFAULT_TOKEN) {
        description.push(description.length ? 'and' : 'with');
        description.push(`token = ${token}`);
    }
    if (treasury && treasury != DeployPreSaleScenario.DEFAULT_TREASURY) {
        description.push(description.length ? 'and' : 'with');
        description.push(`treasury = ${treasury}`);
    }
    if (startTimeOffset != DeployPreSaleScenario.DEFAULT_START_TIME_OFFSET) {
        description.push(description.length ? 'and' : 'with');
        description.push(`startTime = ${formatTimeOffset(startTimeOffset)}`);
    }
    if (endTimeOffset != DeployPreSaleScenario.DEFAULT_END_TIME_OFFSET) {
        description.push(description.length ? 'and' : 'with');
        description.push(`endTime = ${formatTimeOffset(endTimeOffset, 'startTime')}`);
    }
    if (releaseTimeOffset != DeployPreSaleScenario.DEFAULT_RELEASE_TIME_OFFSET) {
        description.push(description.length ? 'and' : 'with');
        description.push(`releaseTime = ${formatTimeOffset(releaseTimeOffset, 'endTime')}`);
    }
    if (exchangeRate != DeployPreSaleScenario.DEFAULT_EXCHANGE_RATE) {
        description.push(description.length ? 'and' : 'with');
        description.push(`exchangeRate = ${formatExchangeRate(exchangeRate)}`);
    }
    if (availableAtRelease != DeployPreSaleScenario.DEFAULT_AVAILABLE_AT_RELEASE) {
        description.push(description.length ? 'and' : 'with');
        description.push(`availableAtRelease = ${formatValue(availableAtRelease)}`);
    }
    if (vestingPeriod != DeployPreSaleScenario.DEFAULT_VESTING_PERIOD) {
        description.push(description.length ? 'and' : 'with');
        description.push(`vestingPeriod = ${formatTimePeriod(vestingPeriod)}`);
    }
    if (vestedAmountPerPeriod != DeployPreSaleScenario.DEFAULT_VESTED_AMOUNT_PER_PERIOD) {
        description.push(description.length ? 'and' : 'with');
        description.push(`vestedAmountPerPeriod = ${formatValue(vestedAmountPerPeriod)}`);
    }
    if (buyLimit != DeployPreSaleScenario.DEFAULT_BUY_LIMIT) {
        description.push(description.length ? 'and' : 'with');
        description.push(`buyLimit = ${formatValue(buyLimit)}`);
    }
    return description;
}

describer.addDescriber(DeployPreSaleScenario, settings => {
    const description = ['deploy'];
    description.push(...describePreSaleSettings(settings));
    return description.join(' ');
});

describer.addDescriber(BuyPreSaleScenario, ({
    value, setupActions, ...settings
}) => {
    const description = ['buy'];
    description.push('using');
    description.push(formatValue(value));
    description.push('ETH');
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    description.push(...describePreSaleSettings(settings));
    return description.join(' ');
});

describer.addDescriber(ClaimPreSaleScenario, ({
    setupActions, ...settings
}) => {
    const description = ['claim'];
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    description.push(...describePreSaleSettings(settings));
    return description.join(' ');
});

describer.addDescriber(BuyPreSaleAction, ({
    value
}) => {
    return `buy using ${formatValue(value)} ETH`;
});

describer.addDescriber(ClaimPreSaleAction, () => {
    return `claim`;
});

describer.addDescriber(FastForwardToStartAction, () => {
    return `fast forward to start`;
});

describer.addDescriber(FastForwardToEndAction, () => {
    return `fast forward to end`;
});

describer.addDescriber(FastForwardToReleaseAction, () => {
    return `fast forward to release`;
});

describer.addDescriber(FastForwardToVestingAction, ({ period }) => {
    return `fast forward to vesting period #${period}`;
});
