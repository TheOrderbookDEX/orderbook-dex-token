import { formatValue } from '@theorderbookdex/abi2ts-lib';
import { ExchangeRate } from '../../src/OrderbookDEXPreSale';

export function formatTimeOffset(offset: bigint, from = 'now'): string {
    if (offset > 0) {
        return `${from} + ${offset}s`;
    } else if (offset < 0) {
        return `${from} - ${-offset}s`;
    } else {
        return from;
    }
}

export function formatExchangeRate(exchangeRate: ExchangeRate): string {
    return formatValue(10n ** 18n * exchangeRate.receivedAmount / exchangeRate.givenAmount);
}
