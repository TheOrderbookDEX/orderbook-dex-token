import { formatValue } from '@theorderbookdex/abi2ts-lib';
import { ExchangeRate } from '../../src/OrderbookDEXPreSale';
import { E18 } from './math';
import { ONE_DAY, ONE_HOUR, ONE_MINUTE } from './timestamp';

export function formatTimeOffset(offset: bigint, from = 'now'): string {
    if (offset > 0) {
        return `${from} + ${formatTimePeriod(offset)}`;
    } else if (offset < 0) {
        return `${from} - ${formatTimePeriod(-offset)}`;
    } else {
        return from;
    }
}

export function formatTimePeriod(timePeriod: bigint): string {
    if (!timePeriod) {
        return '0s';
    }
    const formatted: string[] = [];
    if (timePeriod >= ONE_DAY) {
        formatted.push(`${timePeriod / ONE_DAY}d`);
        timePeriod = timePeriod % ONE_DAY;
    }
    if (timePeriod >= ONE_HOUR) {
        formatted.push(`${timePeriod / ONE_HOUR}h`);
        timePeriod = timePeriod % ONE_HOUR;
    }
    if (timePeriod >= ONE_MINUTE) {
        formatted.push(`${timePeriod / ONE_MINUTE}m`);
        timePeriod = timePeriod % ONE_MINUTE;
    }
    if (timePeriod) {
        formatted.push(`${timePeriod}s`);
    }
    return formatted.join(' ');
}

export function formatExchangeRate(exchangeRate: ExchangeRate): string {
    if (!exchangeRate.givenAmount) return 'NaN';
    return formatValue(E18 * exchangeRate.receivedAmount / exchangeRate.givenAmount);
}
