export const eulerPhiWithDetails = (n: bigint) => {
    let res = n;
    let temp = n;
    const primeFactors: { base: bigint; exp: number }[] = [];

    for (let i = BigInt(2); i * i <= temp; i++) {
        if (temp % i === BigInt(0)) {
            let expCount = 0;
            while (temp % i === BigInt(0)) {
                expCount++;
                temp /= i;
            }
            primeFactors.push({ base: i, exp: expCount });
            res = res - res / i;
        }
    }
    if (temp > BigInt(1)) {
        primeFactors.push({ base: temp, exp: 1 });
        res = res - res / temp;
    }
    return { phi: res, factors: primeFactors };
};
