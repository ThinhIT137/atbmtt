"use client";

import { useLoading } from "@/context/LoadingContext";
import { eulerPhiWithDetails } from "@/hooks/eulerPhiWithDetails";
import { extGCD } from "@/hooks/extGCD";
import { getPrimeFactors } from "@/hooks/getPrimeFactors";
import { gcd } from "@/hooks/gcd";
import { powerMod } from "@/hooks/powerMod";

import React, { useEffect, useState } from "react";

// HÀM KIỂM TRA DẠNG CỦA N CHO CĂN NGUYÊN THỦY
const isValidPrimitiveRootBase = (n: bigint) => {
    if (n <= BigInt(0)) return { valid: false, reason: "n phải lớn hơn 0" };
    if (n === BigInt(1) || n === BigInt(2) || n === BigInt(4))
        return { valid: true, form: n.toString() };

    let temp = n;
    let isEven = false;
    if (temp % BigInt(2) === BigInt(0)) {
        temp /= BigInt(2);
        isEven = true;
        if (temp % BigInt(2) === BigInt(0)) {
            return {
                valid: false,
                reason: "Chứa thừa số 4 (không phải n=1,2,4, p^k, 2p^k)",
            };
        }
    }

    let p = BigInt(0);
    for (let i = BigInt(3); i * i <= temp; i += BigInt(2)) {
        if (temp % i === BigInt(0)) {
            p = i;
            break;
        }
    }
    if (p === BigInt(0) && temp > BigInt(1)) p = temp;

    if (p > BigInt(0)) {
        let k = 0;
        let checkTemp = temp;
        while (checkTemp % p === BigInt(0)) {
            k++;
            checkTemp /= p;
        }
        if (checkTemp === BigInt(1)) {
            return {
                valid: true,
                form: `${isEven ? "2 × " : ""}${p}${k > 1 ? `^${k}` : ""}`,
            };
        }
    }
    return { valid: false, reason: "Có nhiều hơn 1 ước nguyên tố lẻ" };
};

// HÀM HỖ TRỢ 1: LOG BẢNG EUCLID
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
            className="my-2 p-3 bg-gray-50 border rounded-lg shadow-sm"
        >
            <p className="font-bold text-gray-700 mb-2">{title}</p>
            <div className="overflow-x-auto">
                <table className="min-w-full text-center bg-white font-mono text-sm border border-gray-200">
                    <thead className="bg-gray-100 text-gray-700 border-b">
                        <tr>
                            <th className="py-2 px-2">Q</th>
                            <th>A1</th>
                            <th>A2</th>
                            <th>A3</th>
                            <th>B1</th>
                            <th>B2</th>
                            <th>B3</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600">
                        {steps.map((s, i) => (
                            <tr
                                key={i}
                                className="border-b border-gray-100 hover:bg-gray-50"
                            >
                                <td className="py-1 px-2">{s.Q.toString()}</td>
                                <td>{s.A1.toString()}</td>
                                <td>{s.A2.toString()}</td>
                                <td>{s.A3.toString()}</td>
                                <td>{s.B1.toString()}</td>
                                <td className="font-bold text-green-600">
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
                <p className="mt-2 text-green-600">
                    ➔ Nghịch đảo là B2 mod n = {B2.toString()} mod{" "}
                    {N.toString()} ={" "}
                    <b className="text-emerald-600">{((B2 % N) + N) % N}</b>
                </p>
            ) : (
                <p className="mt-2 text-red-600 font-bold">
                    ➔ Dừng vì B3 = 0. Không tồn tại nghịch đảo!
                </p>
            )}
        </div>,
    );
    return {
        inverse: B3 === BigInt(1) ? ((B2 % N) + N) % N : BigInt(-1),
        logNodes: logs,
    };
};

// HÀM HỖ TRỢ 2: LOG TÍNH HÀM EULER
const generateEulerPhiSteps = (n: bigint, startStepNum: number) => {
    const phiData = eulerPhiWithDetails(n);
    let logs: React.ReactNode[] = [];

    const primeStr = phiData.factors
        .map((f) => (f.exp > 1 ? `${f.base}<sup>${f.exp}</sup>` : `${f.base}`))
        .join(" × ");
    const formulaStr = phiData.factors
        .map((f) => `(1 - 1/${f.base})`)
        .join(" × ");

    logs.push(
        <div key={`step_${startStepNum}_a`} className="mb-4 text-gray-800">
            <p className="font-bold text-blue-700 mb-2">
                Bước {startStepNum}: Tính hàm Euler φ({n.toString()})
            </p>
            <div className="ml-4 space-y-2 font-mono bg-gray-50 p-3 rounded border">
                <p>
                    - Phân tích {n.toString()} ={" "}
                    <span dangerouslySetInnerHTML={{ __html: primeStr }}></span>
                </p>
                <p>
                    - Công thức: φ(n) = n × (1 - 1/p<sub>1</sub>) × (1 - 1/p
                    <sub>2</sub>)...
                </p>
                <p>
                    ➔ φ({n.toString()}) = {n.toString()} × {formulaStr} ={" "}
                    <b className="text-lg text-purple-600">
                        {phiData.phi.toString()}
                    </b>
                </p>
            </div>
        </div>,
    );
    return { phiVal: phiData.phi, logNodes: logs };
};

// HÀM HỖ TRỢ 3: LOG HẠ BẬC LŨY THỪA BÌNH PHƯƠNG & NHÂN
const generateExponentiationSteps = (
    A: bigint,
    M_val: bigint,
    N: bigint,
    titlePrefix: string,
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
            className="mb-3 p-3 bg-gray-50 border rounded-lg shadow-sm"
        >
            <p className="font-bold text-gray-700 mb-2">
                {titlePrefix} - Phân tích mũ {M_val.toString()} ra nhị phân:
            </p>
            <div className="ml-4 font-mono text-gray-800 text-sm">
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
                className={`ml-4 ${binRev[i] === "1" ? "font-bold text-gray-800" : "text-gray-400"}`}
            >
                Mũ 2<sup>{i}</sup> : {A.toString()}
                <sup>{currentPow.toString()}</sup> mod {N.toString()} ={" "}
                {currVal.toString()}
                {binRev[i] === "1" && (
                    <span className="text-green-600 ml-2"> (Lấy)</span>
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
            className="mb-3 p-3 bg-gray-50 border rounded-lg shadow-sm"
        >
            <p className="font-bold text-gray-700 mb-2">
                {titlePrefix} - Hạ bậc bình phương liên tiếp:
            </p>
            <div className="space-y-1 font-mono text-sm">{tableLogs}</div>
            <p className="mt-3 font-mono text-gray-800">
                ➔ Kết quả = ({activeValues.join(" × ")}) mod {N.toString()} ={" "}
                <b className="text-blue-600">{finalRes.toString()}</b>
            </p>
        </div>,
    );

    return { resStr: finalRes.toString(), logNodes: logs };
};

// --- COMPONENT CHÍNH ---
export default function ModuloHub() {
    const { setLoading } = useLoading();
    const [mode, setMode] = useState<number>(1);

    const [logs, setLogs] = useState<Record<number, React.ReactNode[]>>({});
    const [results, setResults] = useState<Record<number, string>>({});

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 200);
        return () => clearTimeout(timer);
    }, [setLoading]);

    useEffect(() => {
        setResults({});
        setLogs({});
    }, [mode]);

    const handleCalculate = (
        id: number,
        e: React.FormEvent,
        calcFunc: () => { res: string; log: React.ReactNode[] },
    ) => {
        e.preventDefault();
        try {
            const { res, log } = calcFunc();
            setResults((prev) => ({ ...prev, [id]: res }));
            setLogs((prev) => ({ ...prev, [id]: log }));
        } catch (error: any) {
            alert(`Lỗi ở bài ${id}: ` + error.message);
        }
    };

    // States nhập liệu
    const [b1A, setB1A] = useState("347");
    const [b1M, setB1M] = useState("6829");
    const [b1N, setB1N] = useState("6829");
    const [b2A, setB2A] = useState("2084");
    const [b2N, setB2N] = useState("6113");
    const [b3A, setB3A] = useState("499");
    const [b3M, setB3M] = useState("891");
    const [b3N, setB3N] = useState("6353");
    const [b4N, setB4N] = useState("4432");
    const [b5A, setB5A] = useState("23");
    const [b5M, setB5M] = useState("3304");
    const [b5N, setB5N] = useState("274");
    const [b6A, setB6A] = useState("163");
    const [b6K, setB6K] = useState("79");
    const [b6N, setB6N] = useState("70151");
    const [b7A, setB7A] = useState("9, 5, 4");
    const [b7M, setB7M] = useState("13, 17, 19");

    const [b8A, setB8A] = useState("5");
    const [b8N, setB8N] = useState("257");

    // State bài 9 (đổi từ bài 10)
    const [b9A, setB9A] = useState("5");
    const [b9B, setB9B] = useState("6");
    const [b9N, setB9N] = useState("17");

    // States nhập liệu Bài 10
    const [b10A, setB10A] = useState("53");
    const [b10B, setB10B] = useState("83");
    const [b10X, setB10X] = useState("574");
    const [b10Y, setB10Y] = useState("494");
    const [b10N, setB10N] = useState("331");

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
                <div className="bg-white p-6 text-center border-b border-gray-200">
                    <h1 className="text-3xl font-extrabold text-gray-800">
                        Modulo Hub 🧮
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Giao diện Sáng - Thuật toán chuẩn SGK - Chữ đồng bộ
                    </p>
                </div>

                <div className="p-6 sm:p-10 space-y-8">
                    {/* Chọn bài toán */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            CHỌN BÀI TOÁN CẦN GIẢI:
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-3 font-semibold text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            value={mode}
                            onChange={(e) => setMode(Number(e.target.value))}
                        >
                            <option value={1}>
                                1. TÍNH LŨY THỪA MODULO b = a^m mod n BẰNG HẠ
                                BẬC
                            </option>
                            <option value={2}>
                                2. TÌM NGHỊCH ĐẢO x = a⁻¹ mod n THEO BẢNG EUCLID
                            </option>
                            <option value={3}>
                                3. ĐỊNH LÝ FERMAT: TÍNH LŨY THỪA MODULO b = a^m
                                mod n
                            </option>
                            <option value={4}>
                                4. TÍNH GIÁ TRỊ HÀM EULER φ(n)
                            </option>
                            <option value={5}>
                                5. ĐỊNH LÝ EULER: TÍNH LŨY THỪA MODULO b = a^m
                                mod n
                            </option>
                            <option value={6}>
                                6. ĐỊNH LÝ SỐ DƯ TRUNG HOA (CRT): TÍNH LŨY THỪA
                                b = a^k mod n
                            </option>
                            <option value={7}>
                                7. SỬ DỤNG ĐỊNH LÝ SỐ DƯ TRUNG HOA ĐỂ GIẢI HỆ
                                PHƯƠNG TRÌNH MODULO
                            </option>
                            <option value={8}>
                                8. KIỂM TRA SỐ NGUYÊN a CÓ LÀ MỘT CĂN NGUYÊN
                                THỦY CỦA n
                            </option>
                            <option value={9}>
                                9. TÌM LOGARITHM RỜI RẠC: k = log_a(b) mod n
                            </option>
                            <option value={10}>
                                10. TÍNH CÁC BIỂU THỨC MODULO CƠ BẢN (A1 ➔ A5)
                            </option>
                        </select>
                    </div>

                    <form className="space-y-6">
                        {/* CÁC FORM TỪ 1-8 GIỮ NGUYÊN */}
                        {mode === 1 && (
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Cơ số (a)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b1A}
                                            onChange={(e) =>
                                                setB1A(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập a"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Số mũ (m)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b1M}
                                            onChange={(e) =>
                                                setB1M(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập m"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Modulo (n)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b1N}
                                            onChange={(e) =>
                                                setB1N(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập n"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleCalculate(1, e, () => {
                                            if (!b1A || !b1M || !b1N)
                                                throw new Error(
                                                    "Nhập đủ a, m, n",
                                                );
                                            const { resStr, logNodes } =
                                                generateExponentiationSteps(
                                                    BigInt(b1A),
                                                    BigInt(b1M),
                                                    BigInt(b1N),
                                                    "Bước 1",
                                                );
                                            return {
                                                res: resStr,
                                                log: logNodes,
                                            };
                                        })
                                    }
                                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
                                >
                                    Tính Output Bài 1
                                </button>
                                {results[1] && (
                                    <div className="mt-4 p-4 bg-blue-50 text-blue-700 text-center rounded border border-blue-200 font-bold text-xl font-mono">
                                        Output b = {results[1]}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FORM BÀI 2 */}
                        {mode === 2 && (
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Số a
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b2A}
                                            onChange={(e) =>
                                                setB2A(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập a"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Modulo (n)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b2N}
                                            onChange={(e) =>
                                                setB2N(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-emerald-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập n"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleCalculate(2, e, () => {
                                            if (!b2A || !b2N)
                                                throw new Error("Nhập đủ a, n");
                                            const { inverse, logNodes } =
                                                generateEuclidSteps(
                                                    BigInt(b2A),
                                                    BigInt(b2N),
                                                    `Phân tích thuật toán Euclid mở rộng cho a = ${b2A}, n = ${b2N}:`,
                                                );
                                            return {
                                                res:
                                                    inverse === BigInt(-1)
                                                        ? "Vô nghiệm"
                                                        : inverse.toString(),
                                                log: logNodes,
                                            };
                                        })
                                    }
                                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-lg hover:bg-emerald-700 transition shadow-md"
                                >
                                    Tính Output Bài 2
                                </button>
                                {results[2] && (
                                    <div className="mt-4 p-4 bg-emerald-50 text-emerald-700 font-mono text-center rounded border border-emerald-200 font-bold text-xl">
                                        Output x = {results[2]}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FORM BÀI 3 */}
                        {mode === 3 && (
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Cơ số (a)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b3A}
                                            onChange={(e) =>
                                                setB3A(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-rose-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập a"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Số mũ (m)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b3M}
                                            onChange={(e) =>
                                                setB3M(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-rose-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập m"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Modulo (n)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b3N}
                                            onChange={(e) =>
                                                setB3N(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-rose-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập n"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleCalculate(3, e, () => {
                                            if (!b3A || !b3M || !b3N)
                                                throw new Error(
                                                    "Nhập đủ a, m, n",
                                                );
                                            const a = BigInt(b3A);
                                            const m = BigInt(b3M);
                                            const n = BigInt(b3N);
                                            let logs: React.ReactNode[] = [];

                                            logs.push(
                                                <div
                                                    key="note"
                                                    className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 rounded"
                                                >
                                                    <b>Lưu ý cực mạnh:</b> Định
                                                    lý Fermat nhỏ chỉ áp dụng
                                                    được khi{" "}
                                                    <b>
                                                        n ({n.toString()}) là số
                                                        nguyên tố
                                                    </b>{" "}
                                                    và UCLN(a, n) = 1.
                                                </div>,
                                            );

                                            let m_mod = m % (n - BigInt(1));
                                            logs.push(
                                                <div
                                                    key="step1_f"
                                                    className="mb-6 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 1: Tính số mũ mới
                                                        m'
                                                    </p>
                                                    <div className="ml-4 space-y-1">
                                                        <p>
                                                            Theo Fermat nhỏ, ta
                                                            có: m' = m mod (n -
                                                            1)
                                                        </p>
                                                        <p>
                                                            ➔ m' ={" "}
                                                            {m.toString()} mod (
                                                            {n.toString()} - 1)
                                                        </p>
                                                        <p>
                                                            ➔ m' ={" "}
                                                            <b className="text-lg text-rose-600">
                                                                {m_mod.toString()}
                                                            </b>
                                                        </p>
                                                        <p className="mt-3 text-gray-600 bg-gray-50 p-2 rounded inline-block border">
                                                            Bài toán trở thành:
                                                            Tính {a.toString()}
                                                            <sup>
                                                                {m_mod.toString()}
                                                            </sup>{" "}
                                                            mod {n.toString()}
                                                        </p>
                                                    </div>
                                                </div>,
                                            );

                                            const { resStr, logNodes } =
                                                generateExponentiationSteps(
                                                    a,
                                                    m_mod,
                                                    n,
                                                    "Bước 2",
                                                );
                                            logs.push(...logNodes);

                                            return { res: resStr, log: logs };
                                        })
                                    }
                                    className="w-full bg-rose-600 text-white font-bold py-3 rounded-lg hover:bg-rose-700 transition shadow-md"
                                >
                                    Tính Output Bài 3
                                </button>
                                {results[3] && (
                                    <div className="mt-4 p-4 bg-rose-50 text-rose-700 font-mono text-center rounded border border-rose-200 font-bold text-xl">
                                        Output b = {results[3]}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FORM BÀI 4 */}
                        {mode === 4 && (
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                <div className="flex flex-col w-full sm:w-1/2 mx-auto">
                                    <label className="text-sm font-bold text-gray-600 mb-1 text-center">
                                        Modulo (n)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={b4N}
                                        onChange={(e) =>
                                            setB4N(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-purple-400 focus:outline-none text-center text-lg font-bold text-gray-800"
                                        placeholder="Nhập n"
                                    />
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleCalculate(4, e, () => {
                                            if (!b4N) throw new Error("Nhập n");
                                            const n = BigInt(b4N);
                                            const { phiVal, logNodes } =
                                                generateEulerPhiSteps(n, 1);
                                            return {
                                                res: phiVal.toString(),
                                                log: logNodes,
                                            };
                                        })
                                    }
                                    className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition shadow-md"
                                >
                                    Tính Output Bài 4 (Hàm Euler)
                                </button>
                                {results[4] && (
                                    <div className="mt-4 p-4 bg-purple-50 text-purple-700 font-mono text-center rounded border border-purple-200 font-bold text-xl">
                                        Output φ(n) = {results[4]}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FORM BÀI 5 */}
                        {mode === 5 && (
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Cơ số (a)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b5A}
                                            onChange={(e) =>
                                                setB5A(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-fuchsia-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập a"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Số mũ (m)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b5M}
                                            onChange={(e) =>
                                                setB5M(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-fuchsia-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập m"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Modulo (n)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b5N}
                                            onChange={(e) =>
                                                setB5N(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-fuchsia-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập n"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleCalculate(5, e, () => {
                                            if (!b5A || !b5M || !b5N)
                                                throw new Error(
                                                    "Nhập đủ a, m, n",
                                                );
                                            const a = BigInt(b5A);
                                            const m = BigInt(b5M);
                                            const n = BigInt(b5N);
                                            let logs: React.ReactNode[] = [];

                                            if (gcd(a, n) !== BigInt(1)) {
                                                logs.push(
                                                    <div
                                                        key="warn"
                                                        className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded"
                                                    >
                                                        <b>Cảnh báo:</b> UCLN(a,
                                                        n) ≠ 1 nên không thể áp
                                                        dụng Định lý Euler.
                                                    </div>,
                                                );
                                                return {
                                                    res: "Không tính được",
                                                    log: logs,
                                                };
                                            }

                                            const {
                                                phiVal,
                                                logNodes: phiLogs,
                                            } = generateEulerPhiSteps(n, 1);
                                            logs.push(...phiLogs);

                                            let m_mod = m % phiVal;
                                            logs.push(
                                                <div
                                                    key="step2_e"
                                                    className="mb-6 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 2: Tính số mũ mới
                                                        m'
                                                    </p>
                                                    <div className="ml-4 space-y-1">
                                                        <p>
                                                            Theo Định lý Euler,
                                                            ta có: a
                                                            <sup>φ(n)</sup> ≡ 1
                                                            (mod n)
                                                        </p>
                                                        <p>➔ m' = m mod φ(n)</p>
                                                        <p>
                                                            ➔ m' ={" "}
                                                            {m.toString()} mod{" "}
                                                            {phiVal.toString()}
                                                        </p>
                                                        <p>
                                                            ➔ m' ={" "}
                                                            <b className="text-lg text-fuchsia-600">
                                                                {m_mod.toString()}
                                                            </b>
                                                        </p>
                                                        <p className="mt-3 text-gray-600 bg-gray-50 p-2 rounded inline-block border">
                                                            Bài toán trở thành:
                                                            Tính {a.toString()}
                                                            <sup>
                                                                {m_mod.toString()}
                                                            </sup>{" "}
                                                            mod {n.toString()}
                                                        </p>
                                                    </div>
                                                </div>,
                                            );

                                            const {
                                                resStr,
                                                logNodes: expLogs,
                                            } = generateExponentiationSteps(
                                                a,
                                                m_mod,
                                                n,
                                                "Bước 3",
                                            );
                                            logs.push(...expLogs);

                                            return { res: resStr, log: logs };
                                        })
                                    }
                                    className="w-full bg-fuchsia-600 text-white font-bold py-3 rounded-lg hover:bg-fuchsia-700 transition shadow-md"
                                >
                                    Tính Output Bài 5
                                </button>
                                {results[5] && (
                                    <div className="mt-4 p-4 bg-fuchsia-50 text-fuchsia-700 font-mono text-center rounded border border-fuchsia-200 font-bold text-xl">
                                        Output b = {results[5]}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FORM BÀI 6 (CRT LŨY THỪA) */}
                        {mode === 6 && (
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Cơ số (a)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b6A}
                                            onChange={(e) =>
                                                setB6A(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-yellow-500 focus:outline-none text-gray-800"
                                            placeholder="Nhập a"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Số mũ (k)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b6K}
                                            onChange={(e) =>
                                                setB6K(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-yellow-500 focus:outline-none text-gray-800"
                                            placeholder="Nhập k"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Modulo lớn (n)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b6N}
                                            onChange={(e) =>
                                                setB6N(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-yellow-500 focus:outline-none text-gray-800"
                                            placeholder="Nhập n"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleCalculate(6, e, () => {
                                            if (!b6A || !b6K || !b6N)
                                                throw new Error(
                                                    "Nhập đủ a, k, n",
                                                );
                                            const a = BigInt(b6A);
                                            const k = BigInt(b6K);
                                            const n = BigInt(b6N);
                                            let logs: React.ReactNode[] = [];

                                            const primes = getPrimeFactors(n);
                                            if (primes.length < 2) {
                                                throw new Error(
                                                    "n phải là hợp số (tích của ít nhất 2 số nguyên tố) để áp dụng thuật toán CRT.",
                                                );
                                            }

                                            logs.push(
                                                <div
                                                    key="step1"
                                                    className="mb-4 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 1: Phân tích n ={" "}
                                                        {n.toString()} thành các
                                                        thừa số nguyên tố
                                                    </p>
                                                    <p className="ml-4 font-mono bg-gray-50 p-3 rounded border inline-block">
                                                        n = {n.toString()} ={" "}
                                                        {primes.join(" × ")}
                                                    </p>
                                                </div>,
                                            );

                                            let ais: bigint[] = [];
                                            let b2Logs: React.ReactNode[] = [];

                                            logs.push(
                                                <p
                                                    key="t2"
                                                    className="font-bold text-blue-700 mb-2"
                                                >
                                                    Bước 2: Tính các b
                                                    <sub>i</sub> = a<sup>k</sup>{" "}
                                                    mod p<sub>i</sub> theo
                                                    Fermat nhỏ
                                                </p>,
                                            );

                                            primes.forEach((p, i) => {
                                                let a_mod = a % p;
                                                if (a_mod < BigInt(0))
                                                    a_mod += p;
                                                let k_mod = k % (p - BigInt(1));

                                                b2Logs.push(
                                                    <div
                                                        key={`p${i}`}
                                                        className="mb-6 p-4 border border-dashed border-gray-300 rounded bg-gray-50"
                                                    >
                                                        <p className="font-bold text-gray-800 mb-2 underline">
                                                            ➤ Tính cho p
                                                            <sub>{i + 1}</sub> ={" "}
                                                            {p.toString()}:
                                                        </p>
                                                        <ul className="list-disc ml-6 mb-3 text-sm text-gray-600">
                                                            <li>
                                                                a mod p
                                                                <sub>
                                                                    {i + 1}
                                                                </sub>{" "}
                                                                = {a.toString()}{" "}
                                                                mod{" "}
                                                                {p.toString()} ={" "}
                                                                <b>
                                                                    {a_mod.toString()}
                                                                </b>
                                                            </li>
                                                            <li>
                                                                k mod (p
                                                                <sub>
                                                                    {i + 1}
                                                                </sub>{" "}
                                                                - 1) ={" "}
                                                                {k.toString()}{" "}
                                                                mod{" "}
                                                                {(
                                                                    p -
                                                                    BigInt(1)
                                                                ).toString()}{" "}
                                                                ={" "}
                                                                <b>
                                                                    {k_mod.toString()}
                                                                </b>
                                                            </li>
                                                        </ul>
                                                        <div className="pl-4 border-l-4 border-blue-400 mt-2">
                                                            {
                                                                generateExponentiationSteps(
                                                                    a_mod,
                                                                    k_mod,
                                                                    p,
                                                                    `Tính b${i + 1}`,
                                                                ).logNodes
                                                            }
                                                        </div>
                                                    </div>,
                                                );

                                                let ai = powerMod(
                                                    a_mod,
                                                    k_mod,
                                                    p,
                                                );
                                                ais.push(ai);
                                            });
                                            logs.push(
                                                <div
                                                    key="b2wrap"
                                                    className="ml-4"
                                                >
                                                    {b2Logs}
                                                </div>,
                                            );

                                            let crtEqsLogs = ais.map(
                                                (ai, i) => (
                                                    <p key={`eq${i}`}>
                                                        x ≡ {ai.toString()} (mod{" "}
                                                        {primes[i].toString()})
                                                    </p>
                                                ),
                                            );
                                            logs.push(
                                                <div
                                                    key="step3"
                                                    className="mb-6 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 3: Lập hệ phương
                                                        trình đồng dư
                                                    </p>
                                                    <div className="ml-4 font-mono bg-blue-50 p-3 rounded border border-blue-200 inline-block font-bold text-blue-800">
                                                        {crtEqsLogs}
                                                    </div>
                                                </div>,
                                            );

                                            logs.push(
                                                <p
                                                    key="t4"
                                                    className="font-bold text-blue-700 mb-2"
                                                >
                                                    Bước 4: Tính M<sub>i</sub>{" "}
                                                    và tìm nghịch đảo y
                                                    <sub>i</sub>
                                                </p>,
                                            );

                                            let M_is: bigint[] = [];
                                            let y_is: bigint[] = [];
                                            let b4Logs: React.ReactNode[] = [];

                                            primes.forEach((p, i) => {
                                                let Mi = n / p;
                                                M_is.push(Mi);
                                                let mi_mod = Mi % p;

                                                b4Logs.push(
                                                    <div
                                                        key={`M${i}`}
                                                        className="mb-6 p-4 border border-dashed border-gray-300 rounded bg-gray-50"
                                                    >
                                                        <p className="font-bold text-gray-800 mb-2 underline">
                                                            ➤ Tìm y
                                                            <sub>{i + 1}</sub>{" "}
                                                            cho phương trình{" "}
                                                            {i + 1}:
                                                        </p>
                                                        <ul className="list-disc ml-6 mb-3 text-sm text-gray-600">
                                                            <li>
                                                                M
                                                                <sub>
                                                                    {i + 1}
                                                                </sub>{" "}
                                                                = N / p
                                                                <sub>
                                                                    {i + 1}
                                                                </sub>{" "}
                                                                = {n.toString()}{" "}
                                                                / {p.toString()}{" "}
                                                                ={" "}
                                                                <b>
                                                                    {Mi.toString()}
                                                                </b>
                                                            </li>
                                                            <li>
                                                                M
                                                                <sub>
                                                                    {i + 1}
                                                                </sub>{" "}
                                                                mod p
                                                                <sub>
                                                                    {i + 1}
                                                                </sub>{" "}
                                                                ={" "}
                                                                {Mi.toString()}{" "}
                                                                mod{" "}
                                                                {p.toString()} ={" "}
                                                                <b>
                                                                    {mi_mod.toString()}
                                                                </b>
                                                            </li>
                                                        </ul>
                                                        <div className="pl-4 border-l-4 border-emerald-400 mt-2">
                                                            {
                                                                generateEuclidSteps(
                                                                    mi_mod,
                                                                    p,
                                                                    `Tìm y${i + 1} ≡ (${mi_mod.toString()})⁻¹ mod ${p.toString()}`,
                                                                ).logNodes
                                                            }
                                                        </div>
                                                    </div>,
                                                );

                                                let yi =
                                                    ((extGCD(mi_mod, p).x % p) +
                                                        p) %
                                                    p;
                                                y_is.push(yi);
                                            });
                                            logs.push(
                                                <div
                                                    key="b4wrap"
                                                    className="ml-4"
                                                >
                                                    {b4Logs}
                                                </div>,
                                            );

                                            let totalSum = BigInt(0);
                                            let sumStrDetails: string[] = [];
                                            let sumStrValues: string[] = [];
                                            for (
                                                let i = 0;
                                                i < primes.length;
                                                i++
                                            ) {
                                                let term =
                                                    ais[i] * M_is[i] * y_is[i];
                                                totalSum += term;
                                                sumStrDetails.push(
                                                    `(${ais[i].toString()} × ${M_is[i].toString()} × ${y_is[i].toString()})`,
                                                );
                                                sumStrValues.push(
                                                    `${term.toString()}`,
                                                );
                                            }

                                            let finalRes = totalSum % n;

                                            logs.push(
                                                <div
                                                    key="step5"
                                                    className="mb-4 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 5: Tính tổng CRT và
                                                        lấy modulo N
                                                    </p>
                                                    <div className="ml-4 space-y-2 bg-gray-50 p-4 rounded border border-gray-200 font-mono">
                                                        <p>
                                                            x = Σ(b<sub>i</sub>{" "}
                                                            × M<sub>i</sub> × y
                                                            <sub>i</sub>)
                                                        </p>
                                                        <p className="text-sm text-gray-600 break-all">
                                                            ={" "}
                                                            {sumStrDetails.join(
                                                                " + ",
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-600 break-all">
                                                            ={" "}
                                                            {sumStrValues.join(
                                                                " + ",
                                                            )}
                                                        </p>
                                                        <p>
                                                            x ={" "}
                                                            <b>
                                                                {totalSum.toString()}
                                                            </b>
                                                        </p>
                                                        <div className="mt-4 pt-3 border-t border-gray-300">
                                                            <p className="text-lg font-bold text-yellow-700">
                                                                ➔ Kết quả cuối ={" "}
                                                                {totalSum.toString()}{" "}
                                                                mod{" "}
                                                                {n.toString()} ={" "}
                                                                <span className="text-2xl text-yellow-600">
                                                                    {finalRes.toString()}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>,
                                            );

                                            return {
                                                res: finalRes.toString(),
                                                log: logs,
                                            };
                                        })
                                    }
                                    className="w-full bg-yellow-500 text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition shadow-md"
                                >
                                    Tính Output Bài 6
                                </button>
                                {results[6] && (
                                    <div className="mt-4 p-4 bg-yellow-50 text-yellow-700 font-mono text-center rounded border border-yellow-200 font-bold text-xl">
                                        Output b = {results[6]}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FORM BÀI 7 (GIẢI HỆ PHƯƠNG TRÌNH CRT) */}
                        {mode === 7 && (
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Dãy các số dư a<sub>i</sub> (cách
                                            nhau bởi dấu phẩy)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b7A}
                                            onChange={(e) =>
                                                setB7A(e.target.value)
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none text-gray-800"
                                            placeholder="VD: 9, 5, 4"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Dãy modulo m<sub>i</sub> (cách nhau
                                            bởi dấu phẩy)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b7M}
                                            onChange={(e) =>
                                                setB7M(e.target.value)
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-cyan-500 focus:outline-none text-gray-800"
                                            placeholder="VD: 13, 17, 19"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleCalculate(7, e, () => {
                                            if (!b7A || !b7M)
                                                throw new Error(
                                                    "Nhập đủ dãy a và m",
                                                );

                                            const a_arr = b7A
                                                .split(",")
                                                .map((s) => BigInt(s.trim()));
                                            const m_arr = b7M
                                                .split(",")
                                                .map((s) => BigInt(s.trim()));

                                            if (a_arr.length !== m_arr.length) {
                                                throw new Error(
                                                    "Số lượng phần tử của a và m phải bằng nhau",
                                                );
                                            }

                                            let N = BigInt(1);
                                            m_arr.forEach((m) => (N *= m));

                                            let logs: React.ReactNode[] = [];

                                            let crtEqsLogs = a_arr.map(
                                                (a, i) => (
                                                    <p key={`eq${i}`}>
                                                        x ≡ {a.toString()} (mod{" "}
                                                        {m_arr[i].toString()})
                                                    </p>
                                                ),
                                            );

                                            logs.push(
                                                <div
                                                    key="step1"
                                                    className="mb-6 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 1: Hệ phương trình
                                                        đồng dư (Modulo chung N
                                                        = {N.toString()})
                                                    </p>
                                                    <div className="ml-4 font-mono bg-blue-50 p-3 rounded border border-blue-200 inline-block font-bold text-blue-800">
                                                        {crtEqsLogs}
                                                    </div>
                                                </div>,
                                            );

                                            logs.push(
                                                <p
                                                    key="t2"
                                                    className="font-bold text-blue-700 mb-2"
                                                >
                                                    Bước 2: Tính M<sub>i</sub>{" "}
                                                    và tìm nghịch đảo y
                                                    <sub>i</sub>
                                                </p>,
                                            );

                                            let M_is: bigint[] = [];
                                            let y_is: bigint[] = [];
                                            let b2Logs: React.ReactNode[] = [];

                                            m_arr.forEach((m, i) => {
                                                let Mi = N / m;
                                                M_is.push(Mi);
                                                let mi_mod = Mi % m;

                                                b2Logs.push(
                                                    <div
                                                        key={`M${i}`}
                                                        className="mb-6 p-4 border border-dashed border-gray-300 rounded bg-gray-50"
                                                    >
                                                        <p className="font-bold text-gray-800 mb-2 underline">
                                                            ➤ Tìm y
                                                            <sub>{i + 1}</sub>{" "}
                                                            cho phương trình{" "}
                                                            {i + 1}:
                                                        </p>
                                                        <ul className="list-disc ml-6 mb-3 text-sm text-gray-600">
                                                            <li>
                                                                M
                                                                <sub>
                                                                    {i + 1}
                                                                </sub>{" "}
                                                                = N / m
                                                                <sub>
                                                                    {i + 1}
                                                                </sub>{" "}
                                                                = {N.toString()}{" "}
                                                                / {m.toString()}{" "}
                                                                ={" "}
                                                                <b>
                                                                    {Mi.toString()}
                                                                </b>
                                                            </li>
                                                            <li>
                                                                M
                                                                <sub>
                                                                    {i + 1}
                                                                </sub>{" "}
                                                                mod m
                                                                <sub>
                                                                    {i + 1}
                                                                </sub>{" "}
                                                                ={" "}
                                                                {Mi.toString()}{" "}
                                                                mod{" "}
                                                                {m.toString()} ={" "}
                                                                <b>
                                                                    {mi_mod.toString()}
                                                                </b>
                                                            </li>
                                                        </ul>
                                                        <div className="pl-4 border-l-4 border-emerald-400 mt-2">
                                                            {
                                                                generateEuclidSteps(
                                                                    mi_mod,
                                                                    m,
                                                                    `Tìm y${i + 1} ≡ (${mi_mod.toString()})⁻¹ mod ${m.toString()}`,
                                                                ).logNodes
                                                            }
                                                        </div>
                                                    </div>,
                                                );

                                                let yi =
                                                    ((extGCD(mi_mod, m).x % m) +
                                                        m) %
                                                    m;
                                                y_is.push(yi);
                                            });

                                            logs.push(
                                                <div
                                                    key="b2wrap"
                                                    className="ml-4"
                                                >
                                                    {b2Logs}
                                                </div>,
                                            );

                                            let totalSum = BigInt(0);
                                            let sumStrDetails: string[] = [];
                                            let sumStrValues: string[] = [];

                                            for (
                                                let i = 0;
                                                i < a_arr.length;
                                                i++
                                            ) {
                                                let term =
                                                    a_arr[i] *
                                                    M_is[i] *
                                                    y_is[i];
                                                totalSum += term;
                                                sumStrDetails.push(
                                                    `(${a_arr[i].toString()} × ${M_is[i].toString()} × ${y_is[i].toString()})`,
                                                );
                                                sumStrValues.push(
                                                    `${term.toString()}`,
                                                );
                                            }

                                            let finalRes = totalSum % N;

                                            logs.push(
                                                <div
                                                    key="step3"
                                                    className="mb-4 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 3: Tính tổng CRT và
                                                        lấy modulo N
                                                    </p>
                                                    <div className="ml-4 space-y-2 bg-gray-50 p-4 rounded border border-gray-200 font-mono">
                                                        <p>
                                                            x = Σ(a<sub>i</sub>{" "}
                                                            × M<sub>i</sub> × y
                                                            <sub>i</sub>)
                                                        </p>
                                                        <p className="text-sm text-gray-600 break-all">
                                                            ={" "}
                                                            {sumStrDetails.join(
                                                                " + ",
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-600 break-all">
                                                            ={" "}
                                                            {sumStrValues.join(
                                                                " + ",
                                                            )}
                                                        </p>
                                                        <p>
                                                            x ={" "}
                                                            <b>
                                                                {totalSum.toString()}
                                                            </b>
                                                        </p>
                                                        <div className="mt-4 pt-3 border-t border-gray-300">
                                                            <p className="text-lg font-bold text-cyan-700">
                                                                ➔ Kết quả cuối ={" "}
                                                                {totalSum.toString()}{" "}
                                                                mod{" "}
                                                                {N.toString()} ={" "}
                                                                <span className="text-2xl text-cyan-600">
                                                                    {finalRes.toString()}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>,
                                            );

                                            return {
                                                res: finalRes.toString(),
                                                log: logs,
                                            };
                                        })
                                    }
                                    className="w-full bg-cyan-600 text-white font-bold py-3 rounded-lg hover:bg-cyan-700 transition shadow-md"
                                >
                                    Tính Output Bài 7
                                </button>
                                {results[7] && (
                                    <div className="mt-4 p-4 bg-cyan-50 text-cyan-700 font-mono text-center rounded border border-cyan-200 font-bold text-xl">
                                        Output x = {results[7]}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FORM BÀI 8 (CĂN NGUYÊN THỦY) */}
                        {mode === 8 && (
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Số a
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b8A}
                                            onChange={(e) =>
                                                setB8A(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập a"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Modulo (n)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b8N}
                                            onChange={(e) =>
                                                setB8N(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-800"
                                            placeholder="Nhập n"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleCalculate(8, e, () => {
                                            if (!b8A || !b8N)
                                                throw new Error(
                                                    "Nhập đủ a và n",
                                                );
                                            const a = BigInt(b8A);
                                            const n = BigInt(b8N);
                                            let logs: React.ReactNode[] = [];

                                            // Bước 1: Kiểm tra dạng của N
                                            const formCheck =
                                                isValidPrimitiveRootBase(n);
                                            logs.push(
                                                <div
                                                    key="step1"
                                                    className="mb-4 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 1: Điều kiện tồn
                                                        tại căn nguyên thủy
                                                    </p>
                                                    <div className="ml-4 bg-gray-50 p-3 rounded border border-gray-200">
                                                        <p className="mb-1">
                                                            Căn nguyên thủy
                                                            modulo n chỉ tồn tại
                                                            khi n có dạng: 1, 2,
                                                            4, p<sup>k</sup>,
                                                            hoặc 2p<sup>k</sup>{" "}
                                                            (với p là số nguyên
                                                            tố lẻ).
                                                        </p>
                                                        {formCheck.valid ? (
                                                            <p className="text-green-600 font-bold">
                                                                ➔ n ={" "}
                                                                {n.toString()}{" "}
                                                                thỏa mãn dạng{" "}
                                                                {formCheck.form}
                                                                . Đủ điều kiện
                                                                xét tiếp.
                                                            </p>
                                                        ) : (
                                                            <p className="text-red-600 font-bold">
                                                                ➔ n ={" "}
                                                                {n.toString()}{" "}
                                                                không có dạng
                                                                hợp lệ (
                                                                {
                                                                    formCheck.reason
                                                                }
                                                                ). Không tồn tại
                                                                bất kỳ căn
                                                                nguyên thủy nào!
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>,
                                            );

                                            if (!formCheck.valid)
                                                return {
                                                    res: "Không",
                                                    log: logs,
                                                };

                                            // Bước 2: Tính Phi(n)
                                            const {
                                                phiVal,
                                                logNodes: phiLogs,
                                            } = generateEulerPhiSteps(n, 2);
                                            logs.push(...phiLogs);

                                            // Bước 3: Phân tích Phi(n)
                                            const phiFactors =
                                                getPrimeFactors(phiVal);
                                            logs.push(
                                                <div
                                                    key="step3"
                                                    className="mb-4 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 3: Phân tích φ(n)
                                                        ra thừa số nguyên tố
                                                    </p>
                                                    <div className="ml-4 bg-gray-50 p-3 rounded border border-gray-200 font-mono">
                                                        φ({n.toString()}) ={" "}
                                                        {phiVal.toString()}
                                                        <br />➔ Các ước nguyên
                                                        tố (q<sub>i</sub>) của{" "}
                                                        {phiVal.toString()} là:{" "}
                                                        <b>
                                                            {phiFactors.join(
                                                                ", ",
                                                            )}
                                                        </b>
                                                    </div>
                                                </div>,
                                            );

                                            // Bước 4: Kiểm tra GCD(a, n)
                                            const gcdVal = gcd(a, n);
                                            logs.push(
                                                <div
                                                    key="step4"
                                                    className="mb-4 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 4: Kiểm tra điều
                                                        kiện nguyên tố cùng nhau
                                                    </p>
                                                    <div className="ml-4 bg-gray-50 p-3 rounded border border-gray-200 font-mono">
                                                        UCLN({a.toString()},{" "}
                                                        {n.toString()}) ={" "}
                                                        <b>
                                                            {gcdVal.toString()}
                                                        </b>
                                                        {gcdVal ===
                                                        BigInt(1) ? (
                                                            <span className="text-green-600 ml-2">
                                                                ➔ Thỏa mãn (= 1)
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-600 ml-2">
                                                                ➔ Không thỏa mãn
                                                                (≠ 1). Dừng
                                                                thuật toán!
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>,
                                            );

                                            if (gcdVal !== BigInt(1))
                                                return {
                                                    res: "Không",
                                                    log: logs,
                                                };

                                            // Bước 5: Kiểm tra các số mũ
                                            logs.push(
                                                <div
                                                    key="step5_title"
                                                    className="mb-2 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700">
                                                        Bước 5: Tính a
                                                        <sup>φ(n)/q_i</sup> mod
                                                        n
                                                    </p>
                                                    <p className="ml-4 italic text-sm text-gray-600">
                                                        (Tất cả kết quả phải
                                                        KHÁC 1 thì{" "}
                                                        {a.toString()} mới là
                                                        căn nguyên thủy)
                                                    </p>
                                                </div>,
                                            );

                                            let isPrimitiveRoot = true;
                                            let powLogs: React.ReactNode[] = [];

                                            for (
                                                let i = 0;
                                                i < phiFactors.length;
                                                i++
                                            ) {
                                                const q = phiFactors[i];
                                                const exp = phiVal / q;
                                                const val = powerMod(a, exp, n);

                                                powLogs.push(
                                                    <div
                                                        key={`pow_${q}`}
                                                        className="ml-4 mb-4 p-4 border border-dashed border-gray-300 rounded bg-gray-50"
                                                    >
                                                        <p className="font-bold text-gray-800 mb-2">
                                                            ➤ Với q
                                                            <sub>{i + 1}</sub> ={" "}
                                                            {q.toString()}: Tính
                                                            số mũ φ(n)/q ={" "}
                                                            {phiVal.toString()}{" "}
                                                            / {q.toString()} ={" "}
                                                            {exp.toString()}
                                                        </p>
                                                        <div className="pl-4 border-l-4 border-indigo-400 mt-2 bg-white">
                                                            {
                                                                generateExponentiationSteps(
                                                                    a,
                                                                    exp,
                                                                    n,
                                                                    `Kiểm tra ${a.toString()}^${exp.toString()} mod ${n.toString()}`,
                                                                ).logNodes
                                                            }
                                                        </div>
                                                        {val === BigInt(1) ? (
                                                            <p className="mt-2 text-red-600 font-bold">
                                                                ➔ Kết quả BẰNG
                                                                1! Vậy{" "}
                                                                {a.toString()}{" "}
                                                                KHÔNG phải là
                                                                căn nguyên thủy
                                                                của{" "}
                                                                {n.toString()}.
                                                            </p>
                                                        ) : (
                                                            <p className="mt-2 text-green-600 font-bold">
                                                                ➔ Kết quả ={" "}
                                                                {val.toString()}{" "}
                                                                (KHÁC 1). Thỏa
                                                                mãn cho ước{" "}
                                                                {q.toString()}!
                                                            </p>
                                                        )}
                                                    </div>,
                                                );

                                                if (val === BigInt(1)) {
                                                    isPrimitiveRoot = false;
                                                    break; // Dừng luôn nếu gặp 1
                                                }
                                            }

                                            logs.push(
                                                <div key="pow_wrap">
                                                    {powLogs}
                                                </div>,
                                            );

                                            if (isPrimitiveRoot) {
                                                logs.push(
                                                    <div
                                                        key="final_success"
                                                        className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-center"
                                                    >
                                                        <p className="text-xl font-bold text-green-700">
                                                            Tất cả kết quả đều
                                                            khác 1!
                                                        </p>
                                                        <p className="text-lg text-green-800 mt-2">
                                                            ➔ {a.toString()} LÀ
                                                            căn nguyên thủy của{" "}
                                                            {n.toString()}.
                                                        </p>
                                                    </div>,
                                                );
                                            }

                                            return {
                                                res: isPrimitiveRoot
                                                    ? "Có"
                                                    : "Không",
                                                log: logs,
                                            };
                                        })
                                    }
                                    className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition shadow-md"
                                >
                                    Tính Output Bài 8
                                </button>
                                {results[8] && (
                                    <div
                                        className={`mt-4 p-4 text-center rounded border font-bold text-xl ${results[8] === "Có" ? "bg-green-50 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"}`}
                                    >
                                        Output: {results[8]}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* FORM BÀI 9 (LOGARITHM RỜI RẠC) */}
                        {mode === 9 && (
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Cơ số (a)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b9A}
                                            onChange={(e) =>
                                                setB9A(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-800"
                                            placeholder="Nhập a"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Giá trị (b)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b9B}
                                            onChange={(e) =>
                                                setB9B(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-800"
                                            placeholder="Nhập b"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Modulo (n)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b9N}
                                            onChange={(e) =>
                                                setB9N(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500 focus:outline-none text-gray-800"
                                            placeholder="Nhập n"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleCalculate(9, e, () => {
                                            if (!b9A || !b9B || !b9N)
                                                throw new Error(
                                                    "Nhập đủ a, b, n",
                                                );
                                            const a = BigInt(b9A);
                                            const b = BigInt(b9B);
                                            const n = BigInt(b9N);

                                            let logs: React.ReactNode[] = [];

                                            logs.push(
                                                <div
                                                    key="title"
                                                    className="mb-4 text-gray-800"
                                                >
                                                    <p className="font-bold text-teal-700 mb-2">
                                                        Tìm k sao cho{" "}
                                                        {a.toString()}
                                                        <sup>k</sup> ≡{" "}
                                                        {b.toString()} (mod{" "}
                                                        {n.toString()})
                                                    </p>
                                                    <p className="ml-4 italic text-sm text-gray-600">
                                                        (Thử tuần tự các giá trị
                                                        k từ 1 đến n-1)
                                                    </p>
                                                </div>,
                                            );

                                            let found_k = BigInt(-1);
                                            let current_val = a % n;
                                            let calcLogs: React.ReactNode[] =
                                                [];

                                            for (
                                                let k = BigInt(1);
                                                k < n;
                                                k++
                                            ) {
                                                if (k > BigInt(1)) {
                                                    // Tính tuần tự a^k = (a^(k-1) * a) mod n
                                                    let prev_val = current_val;
                                                    current_val =
                                                        (current_val * a) % n;

                                                    calcLogs.push(
                                                        <div
                                                            key={`k_${k}`}
                                                            className="ml-4 mb-2 p-2 border border-gray-200 rounded bg-gray-50 font-mono text-sm"
                                                        >
                                                            <p>
                                                                k ={" "}
                                                                {k.toString()}:{" "}
                                                                {a.toString()}
                                                                <sup>
                                                                    {k.toString()}
                                                                </sup>{" "}
                                                                = (
                                                                {a.toString()}
                                                                <sup>
                                                                    {(
                                                                        k -
                                                                        BigInt(
                                                                            1,
                                                                        )
                                                                    ).toString()}
                                                                </sup>{" "}
                                                                × {a.toString()}
                                                                ) mod{" "}
                                                                {n.toString()}
                                                            </p>
                                                            <p className="ml-8 mt-1">
                                                                = (
                                                                {prev_val.toString()}{" "}
                                                                × {a.toString()}
                                                                ) mod{" "}
                                                                {n.toString()} ={" "}
                                                                {(
                                                                    prev_val * a
                                                                ).toString()}{" "}
                                                                mod{" "}
                                                                {n.toString()} ={" "}
                                                                <b
                                                                    className={
                                                                        current_val ===
                                                                        b
                                                                            ? "text-green-600 text-base"
                                                                            : "text-gray-700"
                                                                    }
                                                                >
                                                                    {current_val.toString()}
                                                                </b>
                                                                {current_val ===
                                                                    b && (
                                                                    <span className="ml-2 text-green-600">
                                                                        ➔ ≡{" "}
                                                                        {b.toString()}{" "}
                                                                        (Tìm
                                                                        thấy!)
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>,
                                                    );
                                                } else {
                                                    // Trường hợp k=1
                                                    calcLogs.push(
                                                        <div
                                                            key={`k_${k}`}
                                                            className="ml-4 mb-2 p-2 border border-gray-200 rounded bg-gray-50 font-mono text-sm"
                                                        >
                                                            <p>
                                                                k = 1:{" "}
                                                                {a.toString()}
                                                                <sup>
                                                                    1
                                                                </sup> ={" "}
                                                                <b
                                                                    className={
                                                                        current_val ===
                                                                        b
                                                                            ? "text-green-600 text-base"
                                                                            : "text-gray-700"
                                                                    }
                                                                >
                                                                    {current_val.toString()}
                                                                </b>
                                                                {current_val ===
                                                                    b && (
                                                                    <span className="ml-2 text-green-600">
                                                                        ➔ ≡{" "}
                                                                        {b.toString()}{" "}
                                                                        (Tìm
                                                                        thấy!)
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>,
                                                    );
                                                }

                                                if (current_val === b) {
                                                    found_k = k;
                                                    break;
                                                }
                                            }

                                            logs.push(
                                                <div key="calc_logs">
                                                    {calcLogs}
                                                </div>,
                                            );

                                            if (found_k !== BigInt(-1)) {
                                                logs.push(
                                                    <div
                                                        key="result_found"
                                                        className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-center"
                                                    >
                                                        <p className="text-xl font-bold text-green-700">
                                                            Đã tìm thấy k!
                                                        </p>
                                                        <p className="text-lg text-green-800 mt-2">
                                                            ➔ k ={" "}
                                                            {found_k.toString()}
                                                        </p>
                                                    </div>,
                                                );
                                                return {
                                                    res: found_k.toString(),
                                                    log: logs,
                                                };
                                            } else {
                                                logs.push(
                                                    <div
                                                        key="result_not_found"
                                                        className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-center"
                                                    >
                                                        <p className="text-xl font-bold text-red-700">
                                                            Không tìm thấy k!
                                                        </p>
                                                        <p className="text-base text-red-800 mt-2">
                                                            Đã thử tất cả các
                                                            giá trị từ 1 đến{" "}
                                                            {n.toString()} nhưng
                                                            không có giá trị nào
                                                            thỏa mãn.
                                                        </p>
                                                    </div>,
                                                );
                                                return {
                                                    res: "Không tồn tại",
                                                    log: logs,
                                                };
                                            }
                                        })
                                    }
                                    className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 transition shadow-md"
                                >
                                    Tính Output Bài 9
                                </button>
                                {results[9] && (
                                    <div className="mt-4 p-4 bg-teal-50 text-teal-700 font-mono text-center rounded border border-teal-200 font-bold text-xl">
                                        Output k = {results[9]}
                                    </div>
                                )}
                            </div>
                        )}
                        {/* FORM BÀI 10 (BIỂU THỨC MODULO CƠ BẢN) */}
                        {mode === 10 && (
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
                                {/* KHUNG GIẢI THÍCH CÔNG THỨC */}
                                <div className="bg-sky-50 border-l-4 border-sky-500 p-4 rounded-md shadow-sm mb-2">
                                    <p className="font-bold text-sky-800 mb-2 uppercase text-sm">
                                        Mục tiêu: Tính các biểu thức sau
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-gray-700 text-sm sm:text-base ml-2">
                                        <p>
                                            A1 = (a<sup>x</sup> + b<sup>y</sup>)
                                            mod n
                                        </p>
                                        <p>
                                            A2 = (a<sup>x</sup> - b<sup>y</sup>)
                                            mod n
                                        </p>
                                        <p>
                                            A3 = (a<sup>x</sup> × b<sup>y</sup>)
                                            mod n
                                        </p>
                                        <p>
                                            A4 = (b<sup>y</sup>)<sup>-1</sup>{" "}
                                            mod n
                                        </p>
                                        <p>
                                            A5 = (a<sup>x</sup> / b<sup>y</sup>)
                                            mod n
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Cơ số (a)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b10A}
                                            onChange={(e) =>
                                                setB10A(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-800"
                                            placeholder="a"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Cơ số (b)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b10B}
                                            onChange={(e) =>
                                                setB10B(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-800"
                                            placeholder="b"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Mũ (x)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b10X}
                                            onChange={(e) =>
                                                setB10X(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-800"
                                            placeholder="x"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Mũ (y)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b10Y}
                                            onChange={(e) =>
                                                setB10Y(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-800"
                                            placeholder="y"
                                        />
                                    </div>
                                    <div className="flex flex-col col-span-2 sm:col-span-1">
                                        <label className="text-sm font-bold text-gray-600 mb-1">
                                            Modulo (n)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={b10N}
                                            onChange={(e) =>
                                                setB10N(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-sky-500 focus:outline-none text-gray-800"
                                            placeholder="n"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={(e) =>
                                        handleCalculate(10, e, () => {
                                            if (
                                                !b10A ||
                                                !b10B ||
                                                !b10X ||
                                                !b10Y ||
                                                !b10N
                                            )
                                                throw new Error(
                                                    "Nhập đủ a, b, x, y, n",
                                                );

                                            const a = BigInt(b10A);
                                            const b = BigInt(b10B);
                                            const x = BigInt(b10X);
                                            const y = BigInt(b10Y);
                                            const n = BigInt(b10N);
                                            let logs: React.ReactNode[] = [];

                                            // Bước 1: Tính a^x mod n
                                            const step1 =
                                                generateExponentiationSteps(
                                                    a,
                                                    x,
                                                    n,
                                                    "Bước 1: Tính P1 = a^x mod n",
                                                );
                                            logs.push(
                                                <div
                                                    key="s1"
                                                    className="border-l-4 border-sky-400 pl-3 mb-6"
                                                >
                                                    {step1.logNodes}
                                                </div>,
                                            );
                                            const P1 = BigInt(step1.resStr);

                                            // Bước 2: Tính b^y mod n
                                            const step2 =
                                                generateExponentiationSteps(
                                                    b,
                                                    y,
                                                    n,
                                                    "Bước 2: Tính P2 = b^y mod n",
                                                );
                                            logs.push(
                                                <div
                                                    key="s2"
                                                    className="border-l-4 border-sky-400 pl-3 mb-6"
                                                >
                                                    {step2.logNodes}
                                                </div>,
                                            );
                                            const P2 = BigInt(step2.resStr);

                                            // Bước 3: Tính A1, A2, A3
                                            const A1 = (P1 + P2) % n;
                                            const A2 =
                                                (((P1 - P2) % n) + n) % n; // Tránh số âm
                                            const A3 = (P1 * P2) % n;

                                            logs.push(
                                                <div
                                                    key="s3"
                                                    className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded text-gray-800"
                                                >
                                                    <p className="font-bold text-sky-800 mb-2">
                                                        Bước 3: Thay số tính A1,
                                                        A2, A3
                                                    </p>
                                                    <ul className="space-y-2 font-mono ml-4">
                                                        <li>
                                                            ➔{" "}
                                                            <b className="text-blue-600">
                                                                A1
                                                            </b>{" "}
                                                            = ({P1.toString()} +{" "}
                                                            {P2.toString()}) mod{" "}
                                                            {n.toString()} ={" "}
                                                            <b className="text-lg">
                                                                {A1.toString()}
                                                            </b>
                                                        </li>
                                                        <li>
                                                            ➔{" "}
                                                            <b className="text-blue-600">
                                                                A2
                                                            </b>{" "}
                                                            = ({P1.toString()} -{" "}
                                                            {P2.toString()}) mod{" "}
                                                            {n.toString()} ={" "}
                                                            <b className="text-lg">
                                                                {A2.toString()}
                                                            </b>
                                                        </li>
                                                        <li>
                                                            ➔{" "}
                                                            <b className="text-blue-600">
                                                                A3
                                                            </b>{" "}
                                                            = ({P1.toString()} ×{" "}
                                                            {P2.toString()}) mod{" "}
                                                            {n.toString()} ={" "}
                                                            <b className="text-lg">
                                                                {A3.toString()}
                                                            </b>
                                                        </li>
                                                    </ul>
                                                </div>,
                                            );

                                            // Bước 4: Tính A4 = (b^y)^-1 mod n
                                            const step4 = generateEuclidSteps(
                                                P2,
                                                n,
                                                `Bước 4: Tính A4 = (b^y)⁻¹ mod n (Tìm nghịch đảo của P2 = ${P2.toString()} mod ${n.toString()})`,
                                            );
                                            logs.push(
                                                <div
                                                    key="s4"
                                                    className="border-l-4 border-sky-400 pl-3 mb-6"
                                                >
                                                    {step4.logNodes}
                                                </div>,
                                            );
                                            const A4 = step4.inverse;

                                            // Bước 5: Tính A5 = (a^x / b^y) mod n = P1 * A4 mod n
                                            let A5_str = "";
                                            if (A4 === BigInt(-1)) {
                                                A5_str = "Không tồn tại";
                                                logs.push(
                                                    <div
                                                        key="s5"
                                                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-800 font-mono"
                                                    >
                                                        <p className="font-bold">
                                                            Bước 5: Tính A5 =
                                                            (a^x / b^y) mod n
                                                        </p>
                                                        <p className="ml-4 mt-2">
                                                            Vì A4 không tồn tại
                                                            nên không thể chia.
                                                            ➔{" "}
                                                            <b className="text-lg">
                                                                A5 Không tồn tại
                                                            </b>
                                                        </p>
                                                    </div>,
                                                );
                                            } else {
                                                const A5 = (P1 * A4) % n;
                                                A5_str = A5.toString();
                                                logs.push(
                                                    <div
                                                        key="s5"
                                                        className="mb-6 p-4 bg-sky-50 border border-sky-200 rounded text-gray-800"
                                                    >
                                                        <p className="font-bold text-sky-800 mb-2">
                                                            Bước 5: Tính A5 =
                                                            (a^x / b^y) mod n
                                                        </p>
                                                        <ul className="space-y-2 font-mono ml-4">
                                                            <li>
                                                                Phép chia modulo
                                                                chính là nhân
                                                                với nghịch đảo:{" "}
                                                                <br /> A5 = (P1
                                                                × A4) mod n
                                                            </li>
                                                            <li>
                                                                ➔{" "}
                                                                <b className="text-blue-600">
                                                                    A5
                                                                </b>{" "}
                                                                = (
                                                                {P1.toString()}{" "}
                                                                ×{" "}
                                                                {A4.toString()})
                                                                mod{" "}
                                                                {n.toString()} ={" "}
                                                                <b className="text-lg">
                                                                    {A5.toString()}
                                                                </b>
                                                            </li>
                                                        </ul>
                                                    </div>,
                                                );
                                            }

                                            // Format chuỗi kết quả để in ra
                                            const finalResult = `A1 = ${A1} | A2 = ${A2} | A3 = ${A3} | A4 = ${A4 === BigInt(-1) ? "Vô nghiệm" : A4} | A5 = ${A5_str}`;

                                            return {
                                                res: finalResult,
                                                log: logs,
                                            };
                                        })
                                    }
                                    className="w-full bg-sky-600 text-white font-bold py-3 rounded-lg hover:bg-sky-700 transition shadow-md"
                                >
                                    Tính Output Bài 10
                                </button>
                                {results[10] && (
                                    <div className="mt-4 p-4 bg-sky-50 text-sky-800 text-center rounded border border-sky-200 font-bold text-lg font-mono whitespace-pre-wrap leading-relaxed">
                                        {results[10]
                                            .split(" | ")
                                            .map((line, i) => (
                                                <div key={i}>{line}</div>
                                            ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </form>

                    {/* KHU VỰC QUY TRÌNH TÍNH TOÁN HIỂN THỊ CHUNG BÊN DƯỚI */}
                    {Object.keys(logs).length > 0 && (
                        <div className="mt-12 bg-white rounded-xl border border-gray-200 shadow-md p-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-4 uppercase">
                                📜 QUY TRÌNH TÍNH TOÁN CHI TIẾT
                            </h2>
                            <div className="space-y-6">
                                {Object.entries(logs).map(([id, logArray]) => (
                                    <div
                                        key={id}
                                        className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm"
                                    >
                                        <h3 className="text-lg font-bold text-blue-700 mb-4 border-b border-gray-200 pb-2">
                                            ➤ BÀI TẬP {id}
                                        </h3>
                                        <div className="text-base text-gray-700 space-y-2 overflow-x-auto leading-relaxed">
                                            {logArray.map((step, idx) => (
                                                <React.Fragment key={idx}>
                                                    {step}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    setLogs({});
                                    setResults({});
                                }}
                                className="mt-8 bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-lg font-semibold transition shadow-sm"
                            >
                                Xóa toàn bộ Log
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
