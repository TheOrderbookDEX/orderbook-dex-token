import { formatValue } from '@theorderbookdex/abi2ts-lib';
import { Account, ConfigurableDescriber } from '@theorderbookdex/contract-test-helper';
import { BuyPreSaleAction } from '../action/BuyPreSaleAction';
import { CancelPreSaleAction } from '../action/CancelPreSaleAction';
import { ClaimPreSaleAction } from '../action/ClaimPreSaleAction';
import { FastForwardToEarlyEndAction } from '../action/FastForwardToEarlyEndAction';
import { FastForwardToEndAction } from '../action/FastForwardToEndAction';
import { FastForwardToReleaseAction } from '../action/FastForwardToReleaseAction';
import { FastForwardToStartAction } from '../action/FastForwardToStartAction';
import { FastForwardToVestingAction } from '../action/FastForwardToVestingAction';
import { WithdrawPreSaleAction } from '../action/WithdrawPreSaleAction';
import { BuyPreSaleScenario } from '../scenario/BuyPreSaleScenario';
import { CancelPreSaleScenario } from '../scenario/CancelPreSaleScenario';
import { ClaimPreSaleScenario } from '../scenario/ClaimPreSaleScenario';
import { DeployPreSaleScenario } from '../scenario/DeployPreSaleScenario';
import { WithdrawPreSaleScenario } from '../scenario/WithdrawPreSaleScenario';
import { formatExchangeRate, formatTimeOffset, formatTimePeriod } from '../utils/format';

export const describer = new ConfigurableDescriber<void>();

function describePreSaleSettings({
    token, treasury, startTimeOffset, endTimeOffset, releaseTimeOffset, exchangeRate,
    availableAtRelease, vestingPeriod, vestedAmountPerPeriod, buyLimit, successThreshold,
    earlyExchangeRate, earlyEndTimeOffset, earlyLimit
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
    buyLimit: bigint,
    successThreshold: bigint;
    earlyExchangeRate: bigint;
    earlyEndTimeOffset: bigint;
    earlyLimit: bigint;
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
        description.push(`endTime = ${formatTimeOffset(endTimeOffset, 'earlyEndTime')}`);
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
    if (successThreshold != DeployPreSaleScenario.DEFAULT_SUCCESS_THRESHOLD) {
        description.push(description.length ? 'and' : 'with');
        description.push(`successThreshold = ${formatValue(successThreshold)}`);
    }
    if (earlyExchangeRate != DeployPreSaleScenario.DEFAULT_EARLY_EXCHANGE_RATE) {
        description.push(description.length ? 'and' : 'with');
        description.push(`earlyExchangeRate = ${formatValue(earlyExchangeRate)}`);
    }
    if (earlyEndTimeOffset != DeployPreSaleScenario.DEFAULT_EARLY_END_TIME_OFFSET) {
        description.push(description.length ? 'and' : 'with');
        description.push(`earlyEndTime = ${formatTimeOffset(earlyEndTimeOffset, 'startTime')}`);
    }
    if (earlyLimit != DeployPreSaleScenario.DEFAULT_EARLY_LIMIT) {
        description.push(description.length ? 'and' : 'with');
        description.push(`earlyLimit = ${formatValue(earlyLimit)}`);
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

describer.addDescriber(WithdrawPreSaleScenario, ({
    setupActions, ...settings
}) => {
    const description = ['withdraw'];
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    description.push(...describePreSaleSettings(settings));
    return description.join(' ');
});

describer.addDescriber(CancelPreSaleScenario, ({
    setupActions, ...settings
}) => {
    const description = ['cancel'];
    for (const [ index, action ] of setupActions.entries()) {
        description.push(index == 0 ? 'after' : 'and');
        description.push(action.description);
    }
    description.push(...describePreSaleSettings(settings));
    return description.join(' ');
});

describer.addDescriber(BuyPreSaleAction, ({
    account, value
}) => {
    const description = ['buy'];
    description.push('using');
    description.push(formatValue(value));
    description.push('ETH');
    if (account != Account.MAIN) {
        description.push(`using ${account}`)
    }
    return description.join(' ');
});

describer.addDescriber(ClaimPreSaleAction, () => {
    return `claim`;
});

describer.addDescriber(WithdrawPreSaleAction, () => {
    return `withdraw`;
});

describer.addDescriber(CancelPreSaleAction, () => {
    return `cancel`;
});

describer.addDescriber(FastForwardToStartAction, () => {
    return `fast forward to start`;
});

describer.addDescriber(FastForwardToEarlyEndAction, () => {
    return `fast forward to early end`;
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
