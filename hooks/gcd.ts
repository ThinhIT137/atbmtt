export const gcd = (a: bigint, b: bigint): bigint =>
    b === BigInt(0) ? a : gcd(b, a % b);
