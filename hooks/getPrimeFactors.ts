export const getPrimeFactors = (n: bigint) => {
    const factors = new Set<bigint>();
    let temp = n;
    for (let i = BigInt(2); i * i <= temp; i++) {
        while (temp % i === BigInt(0)) {
            factors.add(i);
            temp /= i;
        }
    }
    if (temp > BigInt(1)) factors.add(temp);
    return Array.from(factors);
};
