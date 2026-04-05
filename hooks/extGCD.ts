export const extGCD = (a: bigint, b: bigint) => {
    let r0 = a,
        r1 = b;
    let x0 = BigInt(1),
        x1 = BigInt(0);
    let y0 = BigInt(0),
        y1 = BigInt(1);
    const steps = [];

    while (r1 !== BigInt(0)) {
        let q = r0 / r1;
        steps.push({ q, r0, r1, x0, x1, y0, y1 });
        let r2 = r0 - q * r1;
        let x2 = x0 - q * x1;
        let y2 = y0 - q * y1;
        r0 = r1;
        r1 = r2;
        x0 = x1;
        x1 = x2;
        y0 = y1;
        y1 = y2;
    }
    return { gcd: r0, x: x0, y: y0, steps };
};
