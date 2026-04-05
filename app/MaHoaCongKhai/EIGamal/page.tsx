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
                    ➔ Nghịch đảo K⁻¹ = B2 mod q = {B2.toString()} mod{" "}
                    {N.toString()} ={" "}
                    <b className="text-xl">{((B2 % N) + N) % N}</b>
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
    let currVal = A % N;
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

export default function ElGamal() {
    // Toggle Mode (true = Mã hóa, false = Giải mã)
    const [maHoaMode, setMaHoaMode] = useState(true);

    // Common States
    const [q, setQ] = useState("7243");
    const [a, setA] = useState("3");
    const [xA, setXA] = useState("346");

    // States for Encryption
    const [kVal, setKVal] = useState("42");
    const [M, setM] = useState("428");

    // States for Decryption
    const [C1, setC1] = useState("");
    const [C2, setC2] = useState("");

    const [logs, setLogs] = useState<React.ReactNode[]>([]);
    const [result, setResult] = useState<any>(null);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!q || !a || !xA)
                throw new Error("Vui lòng nhập đủ các thông số q, a, xA");

            const q_bn = BigInt(q);
            const a_bn = BigInt(a);
            const xA_bn = BigInt(xA);

            let allLogs: React.ReactNode[] = [];

            // --- BƯỚC 1: TÍNH KHÓA CÔNG KHAI YA (DÙNG CHUNG) ---
            const stepYA = generateExponentiationSteps(
                a_bn,
                xA_bn,
                q_bn,
                `Tính khóa công khai YA = a^xA mod q`,
                "text-indigo-600",
            );
            const YA_bn = BigInt(stepYA.resStr);

            allLogs.push(
                <div
                    key="stepYA"
                    className="mb-8 p-5 border-l-4 border-indigo-500 bg-white shadow-sm rounded-lg"
                >
                    <h3 className="font-bold text-xl text-indigo-700 mb-4 uppercase">
                        A. Tính Khóa Công Khai (PU) của An
                    </h3>
                    <p className="mb-3 text-gray-700">
                        Công thức:{" "}
                        <b>
                            Y<sub>A</sub> = a<sup>xA</sup> mod q
                        </b>
                    </p>
                    {stepYA.logNodes}
                    <div className="mt-4 p-4 bg-indigo-50 rounded border border-indigo-200 text-center">
                        <p className="text-xl font-bold text-indigo-800">
                            ➔ Khóa công khai: PU = {"{"}q, a, YA{"}"} = {"{"}
                            {q_bn.toString()}, {a_bn.toString()},{" "}
                            {YA_bn.toString()}
                            {"}"}
                        </p>
                    </div>
                </div>,
            );

            if (maHoaMode) {
                // ================= CHẾ ĐỘ MÃ HÓA =================
                if (!kVal || !M)
                    throw new Error(
                        "Vui lòng nhập đủ số k ngẫu nhiên và Bản tin M.",
                    );
                const k_bn = BigInt(kVal);
                const M_bn = BigInt(M);

                // 1. Tính K = YA^k mod q
                const stepK = generateExponentiationSteps(
                    YA_bn,
                    k_bn,
                    q_bn,
                    `Tính khóa phiên K = YA^k mod q`,
                    "text-rose-600",
                );
                const K_bn = BigInt(stepK.resStr);

                allLogs.push(
                    <div
                        key="stepK"
                        className="mb-8 p-5 border-l-4 border-rose-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-rose-700 mb-4 uppercase">
                            B1. Ba tính khóa phiên K
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Công thức:{" "}
                            <b>
                                K = (Y<sub>A</sub>)<sup>k</sup> mod q
                            </b>
                        </p>
                        {stepK.logNodes}
                    </div>,
                );

                // 2. Tính C1 = a^k mod q
                const stepC1 = generateExponentiationSteps(
                    a_bn,
                    k_bn,
                    q_bn,
                    `Tính C1 = a^k mod q`,
                    "text-teal-600",
                );
                const C1_bn = BigInt(stepC1.resStr);

                allLogs.push(
                    <div
                        key="stepC1"
                        className="mb-8 p-5 border-l-4 border-teal-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-teal-700 mb-4 uppercase">
                            B2. Ba tính C1
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Công thức:{" "}
                            <b>
                                C1 = a<sup>k</sup> mod q
                            </b>
                        </p>
                        {stepC1.logNodes}
                    </div>,
                );

                // 3. Tính C2 = (K * M) mod q
                const C2_bn = (K_bn * M_bn) % q_bn;

                allLogs.push(
                    <div
                        key="stepC2"
                        className="mb-8 p-5 border-l-4 border-emerald-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-emerald-700 mb-4 uppercase">
                            B3. Ba tính C2
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Công thức: <b>C2 = (K × M) mod q</b>
                        </p>
                        <div className="ml-4 space-y-2 text-gray-700 font-mono text-lg bg-gray-50 p-4 rounded border border-gray-200">
                            <p>
                                C2 = ({K_bn.toString()} × {M_bn.toString()}) mod{" "}
                                {q_bn.toString()}
                            </p>
                            <p>
                                C2 = {(K_bn * M_bn).toString()} mod{" "}
                                {q_bn.toString()} ={" "}
                                <b className="text-emerald-600 text-2xl">
                                    {C2_bn.toString()}
                                </b>
                            </p>
                        </div>
                        <div className="mt-6 p-4 bg-emerald-50 rounded border border-emerald-200 text-center">
                            <p className="text-xl font-bold text-emerald-800">
                                ➔ Vậy bản mã (Ciphertext) là: C = (C1, C2) = (
                                {C1_bn.toString()}, {C2_bn.toString()})
                            </p>
                        </div>
                    </div>,
                );

                setResult({
                    type: "mahoa",
                    PU: `{${q_bn.toString()}, ${a_bn.toString()}, ${YA_bn.toString()}}`,
                    YA: YA_bn.toString(),
                    C1: C1_bn.toString(),
                    C2: C2_bn.toString(),
                });
            } else {
                // ================= CHẾ ĐỘ GIẢI MÃ =================
                if (!C1 || !C2)
                    throw new Error("Vui lòng nhập đủ Bản mã C1 và C2.");
                const C1_bn = BigInt(C1);
                const C2_bn = BigInt(C2);

                // 1. Tính K = C1^xA mod q
                const stepKDec = generateExponentiationSteps(
                    C1_bn,
                    xA_bn,
                    q_bn,
                    `Tính lại K = C1^xA mod q`,
                    "text-amber-600",
                );
                const K_bn = BigInt(stepKDec.resStr);

                allLogs.push(
                    <div
                        key="stepKDec"
                        className="mb-8 p-5 border-l-4 border-amber-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-amber-700 mb-4 uppercase">
                            C1. An phục hồi khóa phiên K
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Công thức:{" "}
                            <b>
                                K = (C1)<sup>xA</sup> mod q
                            </b>
                        </p>
                        {stepKDec.logNodes}
                    </div>,
                );

                // 2. Tìm nghịch đảo K^-1 mod q
                const stepKInv = generateEuclidSteps(
                    K_bn,
                    q_bn,
                    `Tìm nghịch đảo K⁻¹ mod q ➔ Tìm d ≡ ${K_bn.toString()}⁻¹ mod ${q_bn.toString()}`,
                );
                const K_inv_bn = stepKInv.inverse;

                if (K_inv_bn === BigInt(-1))
                    throw new Error("Không thể tìm được nghịch đảo của K!");

                allLogs.push(
                    <div
                        key="stepKInv"
                        className="mb-8 p-5 border-l-4 border-sky-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-sky-700 mb-4 uppercase">
                            C2. Tính nghịch đảo của K (K⁻¹)
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Sử dụng thuật toán Euclid mở rộng để tìm{" "}
                            <b>K⁻¹ mod q</b>
                        </p>
                        {stepKInv.logNodes}
                    </div>,
                );

                // 3. Tính M = (C2 * K^-1) mod q
                const M_decrypted = (C2_bn * K_inv_bn) % q_bn;

                allLogs.push(
                    <div
                        key="stepMDec"
                        className="mb-8 p-5 border-l-4 border-green-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-green-700 mb-4 uppercase">
                            C3. Phục hồi Bản tin M
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Công thức: <b>M = (C2 × K⁻¹) mod q</b>
                        </p>
                        <div className="ml-4 space-y-2 text-gray-700 font-mono text-lg bg-gray-50 p-4 rounded border border-gray-200">
                            <p>
                                M = ({C2_bn.toString()} × {K_inv_bn.toString()})
                                mod {q_bn.toString()}
                            </p>
                            <p>
                                M = {(C2_bn * K_inv_bn).toString()} mod{" "}
                                {q_bn.toString()} ={" "}
                                <b className="text-green-600 text-2xl">
                                    {M_decrypted.toString()}
                                </b>
                            </p>
                        </div>
                        <div className="mt-6 p-4 bg-green-50 rounded border border-green-200 text-center">
                            <p className="text-xl font-bold text-green-800">
                                ➔ Thông điệp gốc phục hồi được: M ={" "}
                                {M_decrypted.toString()}
                            </p>
                        </div>
                    </div>,
                );

                setResult({
                    type: "giaima",
                    PU: `{${q_bn.toString()}, ${a_bn.toString()}, ${YA_bn.toString()}}`,
                    YA: YA_bn.toString(),
                    M: M_decrypted.toString(),
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
                        Thuật toán ElGamal 🕵️‍♂️
                    </h1>
                    <p className="text-gray-500">
                        Mô phỏng Hệ mật mã khóa công khai dựa trên Logarit Rời
                        Rạc
                    </p>
                </div>

                {/* TOGGLE CHẾ ĐỘ */}
                <div className="flex bg-gray-100 rounded-lg p-1 max-w-md mx-auto shadow-inner">
                    <button
                        onClick={() => {
                            setMaHoaMode(true);
                            setLogs([]);
                            setResult(null);
                        }}
                        className={`w-1/2 py-3 rounded-md font-bold transition-all ${
                            maHoaMode
                                ? "bg-rose-500 text-white shadow-md transform scale-100"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        🔐 Mã Hóa (Tìm C)
                    </button>
                    <button
                        onClick={() => {
                            setMaHoaMode(false);
                            setLogs([]);
                            setResult(null);
                        }}
                        className={`w-1/2 py-3 rounded-md font-bold transition-all ${
                            !maHoaMode
                                ? "bg-amber-500 text-white shadow-md transform scale-100"
                                : "text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        🔓 Giải Mã (Tìm M)
                    </button>
                </div>

                {/* FORM NHẬP LIỆU */}
                <form onSubmit={handleCalculate} className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-700 uppercase border-b border-gray-300 pb-2 mb-4">
                            Thông số Công Khai và Khóa Riêng
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-bold text-gray-600 mb-1">
                                    Số nguyên tố (q)
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
                                    Căn nguyên thủy (a)
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={a}
                                    onChange={(e) =>
                                        setA(e.target.value.replace(/\D/g, ""))
                                    }
                                    className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-bold text-gray-600 mb-1">
                                    Khóa Riêng An (xA)
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={xA}
                                    onChange={(e) =>
                                        setXA(e.target.value.replace(/\D/g, ""))
                                    }
                                    className="border border-sky-300 p-2.5 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className={`p-6 rounded-xl border transition-colors duration-300 ${maHoaMode ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"}`}
                    >
                        {maHoaMode ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-rose-700 mb-2 uppercase">
                                        Hệ số ngẫu nhiên (k)
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
                                        placeholder="VD: 42"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-rose-700 mb-2 uppercase">
                                        Bản tin gốc (M)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={M}
                                        onChange={(e) =>
                                            setM(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-rose-300 p-3 rounded-lg focus:ring-2 focus:ring-rose-400 focus:outline-none font-bold text-lg text-rose-900 shadow-inner"
                                        placeholder="VD: 428"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-amber-700 mb-2 uppercase">
                                        Thành phần mã (C1)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={C1}
                                        onChange={(e) =>
                                            setC1(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-amber-300 p-3 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none font-bold text-lg text-amber-900 shadow-inner"
                                        placeholder="VD: 5991"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-amber-700 mb-2 uppercase">
                                        Thành phần mã (C2)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={C2}
                                        onChange={(e) =>
                                            setC2(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-amber-300 p-3 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none font-bold text-lg text-amber-900 shadow-inner"
                                        placeholder="VD: 1234"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className={`w-full text-white font-bold text-lg py-4 rounded-xl transition shadow-lg uppercase tracking-wide hover:-translate-y-0.5 ${
                            maHoaMode
                                ? "bg-rose-600 hover:bg-rose-700"
                                : "bg-amber-600 hover:bg-amber-700"
                        }`}
                    >
                        {maHoaMode
                            ? "Tiến Hành Mã Hóa (Tìm C1, C2)"
                            : "Tiến Hành Giải Mã (Tìm M)"}
                    </button>
                </form>

                {/* KẾT QUẢ RÚT GỌN TÓM TẮT ĐÁP ÁN */}
                {result && (
                    <div className="bg-gray-800 border-2 border-gray-900 p-6 rounded-xl shadow-lg mt-8">
                        <h2 className="text-xl font-bold text-yellow-400 mb-4 uppercase tracking-widest text-center">
                            🎯 Tóm tắt đáp án
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-lg mb-4">
                            <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-inner text-center">
                                <p className="text-gray-300 font-bold mb-2 text-sm uppercase">
                                    a) Khóa Công Khai (PU)
                                </p>
                                <p className="text-white text-base">
                                    {result.PU}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-inner text-center flex flex-col justify-center">
                                <p className="text-gray-300 font-bold mb-2 text-sm uppercase">
                                    YA của An
                                </p>
                                <p className="text-white text-xl">
                                    {result.YA}
                                </p>
                            </div>
                        </div>

                        {result.type === "mahoa" ? (
                            <div className="p-4 bg-rose-900 border border-rose-700 rounded-lg shadow-inner text-center">
                                <p className="font-bold mb-2 text-sm uppercase text-rose-300">
                                    b) Kết quả Mã hóa: Bản mã C = (C1, C2)
                                </p>
                                <p className="text-white text-2xl font-extrabold">
                                    ({result.C1}, {result.C2})
                                </p>
                            </div>
                        ) : (
                            <div className="p-4 bg-amber-900 border border-amber-700 rounded-lg shadow-inner text-center">
                                <p className="font-bold mb-2 text-sm uppercase text-amber-300">
                                    c) Kết quả Giải mã: Bản tin M
                                </p>
                                <p className="text-white text-2xl font-extrabold">
                                    M = {result.M}
                                </p>
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
