"use client";

import React, { useState } from "react";

// --- HÀM HỖ TRỢ 1: EUCLID MỞ RỘNG (TÌM NGHỊCH ĐẢO) ---
const generateEuclidSteps = (A: bigint, N: bigint, title: string) => {
    let logs: React.ReactNode[] = [];
    let A1 = BigInt(1),
        A2 = BigInt(0),
        A3 = N;
    let B1 = BigInt(0),
        B2 = BigInt(1),
        B3 = A % N;
    let steps = [];
    steps.push({ Q: "-", A1, A2, A3, B1, B2, B3 });

    while (B3 > BigInt(0) && B3 !== BigInt(1)) {
        let Q = A3 / B3;
        let T1 = A1 - Q * B1;
        let T2 = A2 - Q * B2;
        let T3 = A3 - Q * B3;
        A1 = B1;
        A2 = B2;
        A3 = B3;
        B1 = T1;
        B2 = T2;
        B3 = T3;
        steps.push({ Q, A1, A2, A3, B1, B2, B3 });
    }

    logs.push(
        <div
            key={`euclid_${A}_${N}`}
            className="my-2 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
        >
            <p className="font-bold text-gray-700 mb-3">{title}</p>
            <div className="overflow-x-auto">
                <table className="min-w-full text-center bg-white font-mono text-sm border border-gray-200 shadow-sm rounded">
                    <thead className="bg-gray-100 text-gray-700 border-b">
                        <tr>
                            <th className="py-2 px-2 border-r">Q</th>
                            <th className="border-r">A1</th>
                            <th className="border-r">A2</th>
                            <th className="border-r">A3</th>
                            <th className="border-r">B1</th>
                            <th className="border-r">B2</th>
                            <th>B3</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {steps.map((s, i) => (
                            <tr
                                key={i}
                                className="border-b border-gray-100 hover:bg-gray-50"
                            >
                                <td className="py-1 px-2 border-r">
                                    {s.Q.toString()}
                                </td>
                                <td className="border-r">{s.A1.toString()}</td>
                                <td className="border-r">{s.A2.toString()}</td>
                                <td className="border-r">{s.A3.toString()}</td>
                                <td className="border-r">{s.B1.toString()}</td>
                                <td className="font-bold text-green-600 border-r">
                                    {s.B2.toString()}
                                </td>
                                <td className="font-bold text-purple-600">
                                    {s.B3.toString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {B3 === BigInt(1) ? (
                <div className="mt-3 p-2 bg-green-50 border-l-4 border-green-500 text-green-700">
                    ➔ Nghịch đảo = B2 mod N = {B2.toString()} mod {N.toString()}{" "}
                    = <b className="text-xl">{((B2 % N) + N) % N}</b>
                </div>
            ) : (
                <div className="mt-3 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 font-bold">
                    ➔ Dừng vì B3 = 0. Không tồn tại nghịch đảo!
                </div>
            )}
        </div>,
    );
    return {
        inverse: B3 === BigInt(1) ? ((B2 % N) + N) % N : BigInt(-1),
        logNodes: logs,
    };
};

// --- HÀM HỖ TRỢ 2: HẠ BẬC BÌNH PHƯƠNG VÀ NHÂN ---
const generateExponentiationSteps = (
    A: bigint,
    M_val: bigint,
    N: bigint,
    titlePrefix: string,
    colorClass: string = "text-blue-600",
) => {
    let logs: React.ReactNode[] = [];
    let binStr = M_val.toString(2);
    let binRev = binStr.split("").reverse().join("");

    let powerElements: React.ReactNode[] = [];
    let valueElements: string[] = [];
    for (let i = binRev.length - 1; i >= 0; i--) {
        if (binRev[i] === "1") {
            powerElements.push(
                <span key={i}>
                    2<sup>{i}</sup>
                </span>,
            );
            valueElements.push((BigInt(1) << BigInt(i)).toString());
        }
    }

    logs.push(
        <div
            key={`exp_step1_${A}_${M_val}`}
            className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
        >
            <p className={`font-bold ${colorClass} mb-2`}>
                {titlePrefix} - Phân tích số mũ {M_val.toString()} ra nhị phân:
            </p>
            <div className="ml-4 font-mono text-gray-800 text-sm bg-white p-2 rounded border inline-block">
                <p>
                    {M_val.toString()} = {binStr}
                    <sub>2</sub>
                </p>
                <p className="mt-1">
                    ={" "}
                    {powerElements.map((el, idx) => (
                        <React.Fragment key={idx}>
                            {el}
                            {idx < powerElements.length - 1 ? " + " : ""}
                        </React.Fragment>
                    ))}
                </p>
                <p className="mt-1">= {valueElements.join(" + ")}</p>
            </div>
        </div>,
    );

    let currentPow = BigInt(1);
    let currVal = ((A % N) + N) % N; // Xử lý A âm
    let activeValues = [];
    let tableLogs = [];

    for (let i = 0; i < binRev.length; i++) {
        tableLogs.push(
            <div
                key={`pow${i}`}
                className={`p-1 border-b border-gray-100 ${binRev[i] === "1" ? "font-bold text-gray-800 bg-white" : "text-gray-400"}`}
            >
                Mũ 2<sup>{i}</sup> : {A.toString()}
                <sup>{currentPow.toString()}</sup> mod {N.toString()} ={" "}
                {currVal.toString()}
                {binRev[i] === "1" && (
                    <span className="text-green-600 ml-3 uppercase text-xs tracking-wider">
                        ✔ (Lấy)
                    </span>
                )}
            </div>,
        );
        if (binRev[i] === "1") activeValues.push(currVal);
        currVal = (currVal * currVal) % N;
        currentPow *= BigInt(2);
    }

    let finalRes = BigInt(1);
    for (let v of activeValues) finalRes = (finalRes * v) % N;

    logs.push(
        <div
            key={`exp_step2_${A}_${M_val}`}
            className="mb-3 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
        >
            <p className={`font-bold ${colorClass} mb-3`}>
                Tiến hành hạ bậc bình phương liên tiếp:
            </p>
            <div className="font-mono text-sm border-t border-gray-200">
                {tableLogs}
            </div>
            <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 font-mono text-gray-800 rounded">
                ➔ Kết quả = ({activeValues.join(" × ")}) mod {N.toString()} ={" "}
                <b className={`text-xl ${colorClass}`}>{finalRes.toString()}</b>
            </div>
        </div>,
    );

    return { resStr: finalRes.toString(), logNodes: logs };
};

export default function DSA() {
    // Toggle Mode (true = Ký, false = Xác minh)
    const [isSigningMode, setIsSigningMode] = useState(true);

    // Common States
    const [p, setP] = useState("47");
    const [q, setQ] = useState("23");
    const [h, setH] = useState("9");
    const [xA, setXA] = useState("5");

    // States for Signing
    const [kVal, setKVal] = useState("20");
    const [HM, setHM] = useState("14"); // Mặc định do ảnh bị trống

    // States for Verification
    const [yA, setYA] = useState("7");
    const [r, setR] = useState("");
    const [s, setS] = useState("");

    const [logs, setLogs] = useState<React.ReactNode[]>([]);
    const [result, setResult] = useState<any>(null);

    const safeMod = (a: bigint, n: bigint) => ((a % n) + n) % n;

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!p || !q || !h)
                throw new Error("Vui lòng nhập đủ các thông số p, q, h");

            const p_bn = BigInt(p);
            const q_bn = BigInt(q);
            const h_bn = BigInt(h);

            // Ràng buộc DSA: (p-1) phải chia hết cho q
            if ((p_bn - BigInt(1)) % q_bn !== BigInt(0)) {
                throw new Error(
                    `Lỗi: (p-1) không chia hết cho q. ( ${p_bn - BigInt(1)} không chia hết cho ${q_bn} )`,
                );
            }

            let allLogs: React.ReactNode[] = [];

            // --- BƯỚC 1: TÍNH g VÀ KHÓA CÔNG KHAI YA ---
            const exp_g = (p_bn - BigInt(1)) / q_bn;
            const stepG = generateExponentiationSteps(
                h_bn,
                exp_g,
                p_bn,
                `Tính g = h^((p-1)/q) mod p = ${h_bn.toString()}^${exp_g.toString()} mod ${p_bn.toString()}`,
                "text-indigo-600",
            );
            const g_bn = BigInt(stepG.resStr);

            if (g_bn <= BigInt(1))
                throw new Error(
                    "Lỗi: Giá trị g tính ra <= 1, hãy chọn h khác.",
                );

            let yA_bn = BigInt(0);

            if (isSigningMode) {
                if (!xA) throw new Error("Cần nhập Khóa riêng xA");
                const xA_bn = BigInt(xA);

                const stepYA = generateExponentiationSteps(
                    g_bn,
                    xA_bn,
                    p_bn,
                    `Tính Khóa công khai yA = g^xA mod p`,
                    "text-indigo-600",
                );
                yA_bn = BigInt(stepYA.resStr);

                allLogs.push(
                    <div
                        key="stepYA"
                        className="mb-8 p-5 border-l-4 border-indigo-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-indigo-700 mb-4 uppercase">
                            a) Tính Khóa Công Khai (PU) của An
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Trước tiên cần tính{" "}
                            <b>
                                g = h<sup>(p-1)/q</sup> mod p
                            </b>
                        </p>
                        {stepG.logNodes}
                        <p className="mt-4 mb-3 text-gray-700">
                            Tiếp theo tính Khóa công khai:{" "}
                            <b>
                                yA = g<sup>xA</sup> mod p
                            </b>
                        </p>
                        {stepYA.logNodes}
                        <div className="mt-4 p-4 bg-indigo-50 rounded border border-indigo-200 text-center">
                            <p className="text-xl font-bold text-indigo-800">
                                ➔ Khóa công khai: PU = {"{"}p, q, g, yA{"}"} ={" "}
                                {"{"}
                                {p_bn.toString()}, {q_bn.toString()},{" "}
                                {g_bn.toString()}, {yA_bn.toString()}
                                {"}"}
                            </p>
                        </div>
                    </div>,
                );

                // ================= CHẾ ĐỘ TẠO CHỮ KÝ =================
                if (!kVal || !HM)
                    throw new Error("Vui lòng nhập đủ k và H(M).");
                const k_bn = BigInt(kVal);
                const HM_bn = BigInt(HM);

                // 1. Tính r = (g^k mod p) mod q
                const stepR = generateExponentiationSteps(
                    g_bn,
                    k_bn,
                    p_bn,
                    `Tính g^k mod p`,
                    "text-rose-600",
                );
                const gk_mod_p = BigInt(stepR.resStr);
                const r_bn = safeMod(gk_mod_p, q_bn);

                allLogs.push(
                    <div
                        key="stepR"
                        className="mb-8 p-5 border-l-4 border-rose-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-rose-700 mb-4 uppercase">
                            b) Ký số - Bước 1: Tính thành phần r
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Công thức:{" "}
                            <b>
                                r = (g<sup>k</sup> mod p) mod q
                            </b>
                        </p>
                        {stepR.logNodes}
                        <div className="mt-3 bg-gray-50 p-3 rounded border font-mono">
                            ➔ r = {gk_mod_p.toString()} mod {q_bn.toString()} ={" "}
                            <b className="text-rose-600 text-xl">
                                {r_bn.toString()}
                            </b>
                        </div>
                    </div>,
                );

                // 2. Tính nghịch đảo k^-1 mod q
                const stepKInv = generateEuclidSteps(
                    k_bn,
                    q_bn,
                    `Tìm k⁻¹ mod q ➔ Tìm d ≡ ${k_bn.toString()}⁻¹ mod ${q_bn.toString()}`,
                );
                const k_inv_bn = stepKInv.inverse;
                if (k_inv_bn === BigInt(-1))
                    throw new Error(
                        "k không có nghịch đảo mod q, vui lòng chọn k khác!",
                    );

                allLogs.push(
                    <div
                        key="stepKInv"
                        className="mb-8 p-5 border-l-4 border-amber-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-amber-700 mb-4 uppercase">
                            b) Ký số - Bước 2: Tìm nghịch đảo k⁻¹ mod q
                        </h3>
                        {stepKInv.logNodes}
                    </div>,
                );

                // 3. Tính s = k^-1 * (H(M) + xA * r) mod q
                const xr = safeMod(xA_bn * r_bn, q_bn);
                const innerSum = HM_bn + xr;
                const s_bn = safeMod(k_inv_bn * innerSum, q_bn);

                if (r_bn === BigInt(0) || s_bn === BigInt(0)) {
                    throw new Error(
                        "Lỗi: r hoặc s bằng 0. Trong DSA phải chọn lại giá trị k ngẫu nhiên khác!",
                    );
                }

                allLogs.push(
                    <div
                        key="stepS"
                        className="mb-8 p-5 border-l-4 border-emerald-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-emerald-700 mb-4 uppercase">
                            b) Ký số - Bước 3: Tính thành phần s
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Công thức: <b>s = k⁻¹ × (H(M) + xA × r) mod q</b>
                        </p>
                        <div className="ml-4 space-y-2 text-gray-700 font-mono text-lg bg-gray-50 p-4 rounded border border-gray-200">
                            <p>
                                s = {k_inv_bn.toString()} × ({HM_bn.toString()}{" "}
                                + {xA_bn.toString()} × {r_bn.toString()}) mod{" "}
                                {q_bn.toString()}
                            </p>
                            <p>
                                s = {k_inv_bn.toString()} × ({HM_bn.toString()}{" "}
                                + {xr.toString()}) mod {q_bn.toString()}
                            </p>
                            <p>
                                s = {k_inv_bn.toString()} ×{" "}
                                {innerSum.toString()} mod {q_bn.toString()}
                            </p>
                            <p>
                                s = {(k_inv_bn * innerSum).toString()} mod{" "}
                                {q_bn.toString()} ={" "}
                                <b className="text-emerald-600 text-2xl">
                                    {s_bn.toString()}
                                </b>
                            </p>
                        </div>
                        <div className="mt-6 p-4 bg-emerald-50 rounded border border-emerald-200 text-center">
                            <p className="text-xl font-bold text-emerald-800">
                                ➔ Chữ ký số tạo ra là: (r, s) = (
                                {r_bn.toString()}, {s_bn.toString()})
                            </p>
                        </div>
                    </div>,
                );

                setResult({
                    type: "sign",
                    yA: yA_bn.toString(),
                    r: r_bn.toString(),
                    s: s_bn.toString(),
                });
            } else {
                // ================= CHẾ ĐỘ XÁC MINH CHỮ KÝ =================
                if (!HM || !r || !s || !yA)
                    throw new Error("Vui lòng nhập đủ H(M), r, s, và yA.");
                const HM_bn = BigInt(HM);
                const r_bn = BigInt(r);
                const s_bn = BigInt(s);
                const yA_bn = BigInt(yA);

                if (
                    r_bn <= BigInt(0) ||
                    r_bn >= q_bn ||
                    s_bn <= BigInt(0) ||
                    s_bn >= q_bn
                ) {
                    allLogs.push(
                        <div
                            key="errVal"
                            className="mb-8 p-5 border-l-4 border-red-500 bg-red-50 rounded-lg"
                        >
                            <h3 className="font-bold text-xl text-red-700">
                                Xác minh thất bại (Invalid Range)
                            </h3>
                            <p>
                                r và s phải nằm trong khoảng (0, q). Chữ ký này
                                không hợp lệ!
                            </p>
                        </div>,
                    );
                    setResult({ type: "verify", valid: false });
                    setLogs(allLogs);
                    return;
                }

                // 1. Tính g
                allLogs.push(
                    <div
                        key="stepG"
                        className="mb-8 p-5 border-l-4 border-indigo-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-indigo-700 mb-4 uppercase">
                            c) Xác minh - Bước 1: Tính lại tham số g
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Cần thiết lập lại{" "}
                            <b>
                                g = h<sup>(p-1)/q</sup> mod p
                            </b>{" "}
                            từ các thông số chung
                        </p>
                        {stepG.logNodes}
                    </div>,
                );

                // 2. w = s^-1 mod q
                const stepW = generateEuclidSteps(
                    s_bn,
                    q_bn,
                    `Tìm w ≡ s⁻¹ mod q ➔ Tìm w ≡ ${s_bn.toString()}⁻¹ mod ${q_bn.toString()}`,
                );
                const w_bn = stepW.inverse;
                if (w_bn === BigInt(-1))
                    throw new Error("s không có nghịch đảo mod q!");

                allLogs.push(
                    <div
                        key="stepW"
                        className="mb-8 p-5 border-l-4 border-amber-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-amber-700 mb-4 uppercase">
                            c) Xác minh - Bước 2: Tính w = s⁻¹ mod q
                        </h3>
                        {stepW.logNodes}
                    </div>,
                );

                // 3. u1 = H(M)*w mod q, u2 = r*w mod q
                const u1_bn = safeMod(HM_bn * w_bn, q_bn);
                const u2_bn = safeMod(r_bn * w_bn, q_bn);

                allLogs.push(
                    <div
                        key="stepU"
                        className="mb-8 p-5 border-l-4 border-sky-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-sky-700 mb-4 uppercase">
                            c) Xác minh - Bước 3: Tính u1 và u2
                        </h3>
                        <div className="space-y-3 font-mono bg-gray-50 p-4 rounded border">
                            <p>
                                u1 = (H(M) × w) mod q = ({HM_bn.toString()} ×{" "}
                                {w_bn.toString()}) mod {q_bn.toString()} ={" "}
                                <b className="text-sky-600">
                                    {u1_bn.toString()}
                                </b>
                            </p>
                            <p>
                                u2 = (r × w) mod q = ({r_bn.toString()} ×{" "}
                                {w_bn.toString()}) mod {q_bn.toString()} ={" "}
                                <b className="text-sky-600">
                                    {u2_bn.toString()}
                                </b>
                            </p>
                        </div>
                    </div>,
                );

                // 4. v = ((g^u1 * yA^u2) mod p) mod q
                const stepP1 = generateExponentiationSteps(
                    g_bn,
                    u1_bn,
                    p_bn,
                    `Tính P1 = g^u1 mod p`,
                    "text-teal-600",
                );
                const P1_bn = BigInt(stepP1.resStr);

                const stepP2 = generateExponentiationSteps(
                    yA_bn,
                    u2_bn,
                    p_bn,
                    `Tính P2 = yA^u2 mod p`,
                    "text-teal-600",
                );
                const P2_bn = BigInt(stepP2.resStr);

                const v_temp = safeMod(P1_bn * P2_bn, p_bn);
                const v_bn = safeMod(v_temp, q_bn);

                allLogs.push(
                    <div
                        key="stepV"
                        className="mb-8 p-5 border-l-4 border-teal-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-teal-700 mb-4 uppercase">
                            c) Xác minh - Bước 4: Tính giá trị đối chiếu v
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Công thức:{" "}
                            <b>
                                v = ((g<sup>u1</sup> × yA<sup>u2</sup>) mod p)
                                mod q
                            </b>
                        </p>
                        {stepP1.logNodes}
                        <div className="my-4"></div>
                        {stepP2.logNodes}
                        <div className="mt-4 space-y-2 text-gray-700 font-mono text-lg bg-gray-50 p-4 rounded border border-gray-200">
                            <p>
                                Gộp lại: (P1 × P2) mod p = ({P1_bn.toString()} ×{" "}
                                {P2_bn.toString()}) mod {p_bn.toString()} ={" "}
                                {v_temp.toString()}
                            </p>
                            <p>
                                v = {v_temp.toString()} mod q ={" "}
                                {v_temp.toString()} mod {q_bn.toString()} ={" "}
                                <b className="text-teal-600 text-2xl">
                                    {v_bn.toString()}
                                </b>
                            </p>
                        </div>
                    </div>,
                );

                // 5. Kiểm tra v == r
                const isValid = v_bn === r_bn;
                allLogs.push(
                    <div
                        key="stepFinal"
                        className={`mb-8 p-6 border-l-8 shadow-md rounded-lg text-center ${isValid ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}
                    >
                        <h3
                            className={`font-bold text-2xl mb-2 uppercase ${isValid ? "text-green-700" : "text-red-700"}`}
                        >
                            c) Xác minh - Bước 5: Kết Luận
                        </h3>
                        <p className="text-xl font-mono mb-2">
                            So sánh <b>v</b> và <b>r</b>:
                        </p>
                        <p className="text-2xl font-mono font-bold mb-4">
                            v = {v_bn.toString()} {isValid ? "==" : "≠"} r ={" "}
                            {r_bn.toString()}
                        </p>
                        {isValid ? (
                            <p className="text-xl font-bold text-green-800 bg-green-200 p-3 rounded">
                                ✅ Chữ ký HỢP LỆ! Thông điệp không bị thay đổi.
                            </p>
                        ) : (
                            <p className="text-xl font-bold text-red-800 bg-red-200 p-3 rounded">
                                ❌ Chữ ký KHÔNG HỢP LỆ! Bản tin có thể đã bị giả
                                mạo.
                            </p>
                        )}
                    </div>,
                );

                setResult({
                    type: "verify",
                    v: v_bn.toString(),
                    r: r_bn.toString(),
                    valid: isValid,
                });
            }

            setLogs(allLogs);
        } catch (error: any) {
            alert("Lỗi: " + error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-4xl p-6 sm:p-10 space-y-8">
                {/* HEADER */}
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-extrabold text-gray-800">
                        Chữ Ký Điện Tử DSA ✍️
                    </h1>
                    <p className="text-gray-500">
                        Mô phỏng Digital Signature Algorithm (NIST Standard)
                    </p>
                </div>

                {/* TOGGLE CHẾ ĐỘ */}
                <div className="flex bg-gray-100 rounded-lg p-1 max-w-md mx-auto shadow-inner">
                    <button
                        onClick={() => {
                            setIsSigningMode(true);
                            setLogs([]);
                            setResult(null);
                        }}
                        className={`w-1/2 py-3 rounded-md font-bold transition-all ${
                            isSigningMode
                                ? "bg-rose-500 text-white shadow-md transform scale-100"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        🖋️ Tạo Chữ Ký (Tìm r, s)
                    </button>
                    <button
                        onClick={() => {
                            setIsSigningMode(false);
                            setLogs([]);
                            setResult(null);
                        }}
                        className={`w-1/2 py-3 rounded-md font-bold transition-all ${
                            !isSigningMode
                                ? "bg-teal-500 text-white shadow-md transform scale-100"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        🔍 Xác Minh (Check v == r)
                    </button>
                </div>

                {/* FORM NHẬP LIỆU */}
                <form onSubmit={handleCalculate} className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-700 uppercase border-b border-gray-300 pb-2 mb-4">
                            Thông số Công Khai DSA
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-bold text-gray-600 mb-1">
                                    Số nguyên tố (p)
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={p}
                                    onChange={(e) =>
                                        setP(e.target.value.replace(/\D/g, ""))
                                    }
                                    className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-bold text-gray-600 mb-1">
                                    Ước nguyên tố (q)
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={q}
                                    onChange={(e) =>
                                        setQ(e.target.value.replace(/\D/g, ""))
                                    }
                                    className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-bold text-gray-600 mb-1">
                                    Hệ số (h)
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={h}
                                    onChange={(e) =>
                                        setH(e.target.value.replace(/\D/g, ""))
                                    }
                                    className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className={`p-6 rounded-xl border transition-colors duration-300 ${isSigningMode ? "bg-rose-50 border-rose-200" : "bg-teal-50 border-teal-200"}`}
                    >
                        {isSigningMode ? (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-rose-700 mb-2 uppercase">
                                        Mã băm H(M)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={HM}
                                        onChange={(e) =>
                                            setHM(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-rose-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none font-bold text-lg text-rose-900 shadow-inner"
                                        placeholder="VD: 14"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-rose-700 mb-2 uppercase">
                                        Khóa riêng (xA)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={xA}
                                        onChange={(e) =>
                                            setXA(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-rose-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none font-bold text-lg text-rose-900 shadow-inner"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-rose-700 mb-2 uppercase">
                                        Số ngẫu nhiên (k)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={kVal}
                                        onChange={(e) =>
                                            setKVal(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-rose-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none font-bold text-lg text-rose-900 shadow-inner"
                                        placeholder="VD: 20"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-teal-700 mb-2 uppercase">
                                        Khóa Y_A
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={yA}
                                        onChange={(e) =>
                                            setYA(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-teal-300 p-3 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none font-bold text-lg text-teal-900 shadow-inner"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-teal-700 mb-2 uppercase">
                                        Mã băm H(M)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={HM}
                                        onChange={(e) =>
                                            setHM(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-teal-300 p-3 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none font-bold text-lg text-teal-900 shadow-inner"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-teal-700 mb-2 uppercase">
                                        Chữ ký (r)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={r}
                                        onChange={(e) =>
                                            setR(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-teal-300 p-3 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none font-bold text-lg text-teal-900 shadow-inner"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-teal-700 mb-2 uppercase">
                                        Chữ ký (s)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={s}
                                        onChange={(e) =>
                                            setS(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-teal-300 p-3 rounded-lg focus:ring-2 focus:ring-teal-400 focus:outline-none font-bold text-lg text-teal-900 shadow-inner"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`w-full text-white font-bold text-lg py-4 rounded-xl transition shadow-lg uppercase tracking-wide hover:-translate-y-0.5 ${
                            isSigningMode
                                ? "bg-rose-600 hover:bg-rose-700"
                                : "bg-teal-600 hover:bg-teal-700"
                        }`}
                    >
                        {isSigningMode
                            ? "Tạo Chữ Ký Số (r, s)"
                            : "Tiến Hành Xác Minh Chữ Ký"}
                    </button>
                </form>

                {/* KẾT QUẢ RÚT GỌN TÓM TẮT ĐÁP ÁN */}
                {result && (
                    <div className="bg-gray-800 border-2 border-gray-700 p-6 rounded-xl shadow-lg mt-8">
                        <h2 className="text-xl font-bold text-yellow-400 mb-6 uppercase tracking-widest text-center">
                            🎯 Tóm tắt đáp án
                        </h2>

                        {result.type === "sign" ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-lg mb-4">
                                <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-inner text-center flex flex-col justify-center">
                                    <p className="text-sky-300 font-bold mb-2 text-base uppercase">
                                        a) Khóa Công Khai (yA)
                                    </p>
                                    <p className="text-white text-3xl font-bold">
                                        {result.yA}
                                    </p>
                                </div>
                                <div className="p-4 bg-rose-900 border border-rose-700 rounded-lg shadow-inner text-center flex flex-col justify-center">
                                    <p className="text-rose-300 font-bold mb-2 text-base uppercase">
                                        b) Chữ ký số (r, s)
                                    </p>
                                    <p className="text-white text-3xl font-extrabold">
                                        ({result.r}, {result.s})
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={`p-6 border-2 rounded-lg shadow-inner text-center ${result.valid ? "bg-green-800 border-green-500" : "bg-red-800 border-red-500"}`}
                            >
                                <p className="text-white font-bold mb-4 text-xl uppercase tracking-wider">
                                    c) Kết Quả Xác Minh
                                </p>
                                <p className="text-yellow-200 text-3xl font-extrabold font-mono mb-4">
                                    v = {result.v} | r = {result.r}
                                </p>
                                <div className="inline-block bg-white px-6 py-2 rounded-full shadow-md">
                                    <p
                                        className={`text-xl font-extrabold uppercase ${result.valid ? "text-green-600" : "text-red-600"}`}
                                    >
                                        {result.valid
                                            ? "✅ Chữ ký hợp lệ"
                                            : "❌ Chữ ký KHÔNG hợp lệ"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* LOGS CHI TIẾT */}
                {logs.length > 0 && (
                    <div className="mt-12 pt-8 border-t-2 border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8 border-l-4 border-indigo-500 pl-4 uppercase">
                            📝 Trình Bày Chi Tiết Bài Giải
                        </h2>
                        <div className="space-y-4">{logs}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
