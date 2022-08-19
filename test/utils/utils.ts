import { formatValue } from '@theorderbookdex/abi2ts-lib';
import { ExchangeRate } from '../../src/OrderbookDEXPreSale';

export function formatTimeOffset(offset: bigint): string {
    if (offset > 0) {
        return `now + ${offset}s`;
    } else if (offset < 0) {
        return `now - ${-offset}s`;
    } else {
        return 'now';
    }
}

export function formatExchangeRate(exchangeRate: ExchangeRate): string {
    return formatValue(10n ** 18n * exchangeRate.receivedAmount / exchangeRate.givenAmount);
}
