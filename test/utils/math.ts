export function min(...numbers: bigint[]): bigint {
    return numbers.reduce((a, b) => a < b ? a : b);
}
