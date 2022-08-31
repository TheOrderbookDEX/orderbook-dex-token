export const E18 = 10n ** 18n;

export function min(a: bigint, b: bigint): bigint {
    return a < b ? a : b;
}
