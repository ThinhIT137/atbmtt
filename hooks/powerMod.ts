export const powerMod = (base: bigint, exp: bigint, mod: bigint) => {
    let res = BigInt(1);
    let b = base % mod;
    let e = exp;
    while (e > BigInt(0)) {
        if (e % BigInt(2) === BigInt(1)) res = (res * b) % mod;
        b = (b * b) % mod;
        e /= BigInt(2);
    }
    return res;
};
