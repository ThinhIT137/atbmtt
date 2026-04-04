"use client";

import { useLoading } from "@/context/LoadingContext";
import React, { useEffect, useState } from "react";

// --- CÁC HÀM TOÁN HỌC CORE (BigInt) ---
const gcd = (a: bigint, b: bigint): bigint =>
    b === BigInt(0) ? a : gcd(b, a % b);

const powerMod = (base: bigint, exp: bigint, mod: bigint) => {
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

const extGCD = (a: bigint, b: bigint) => {
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

// Cập nhật hàm Euler để trả về phân tích lũy thừa (VD: 2^4 * 277^1)
const eulerPhiWithDetails = (n: bigint) => {
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

// HÀM HỖ TRỢ: TẠO GIAO DIỆN HẠ BẬC LŨY THỪA (Dùng chung cho B1, B3)
const generateExponentiationSteps = (
    A: bigint,
    M_val: bigint,
    N: bigint,
    startStepNum: number,
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
        <div key={`step_${startStepNum}`} className="mb-4">
            <p className="font-bold text-blue-700 mb-2">
                Bước {startStepNum}: Phân tích số mũ m = {M_val.toString()} ra
                hệ nhị phân:
            </p>
            <div className="ml-4 font-mono bg-gray-50 p-3 rounded border border-gray-200 inline-block text-gray-800">
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

    logs.push(
        <div key={`step_${startStepNum + 1}`} className="mb-4">
            <p className="font-bold text-blue-700 mb-2">
                Bước {startStepNum + 1}: Hạ bậc dần bằng cách bình phương liên
                tiếp:
            </p>
            <div className="space-y-1 font-mono">{tableLogs}</div>
        </div>,
    );

    let finalRes = BigInt(1);
    for (let v of activeValues) finalRes = (finalRes * v) % N;

    logs.push(
        <div key={`step_${startStepNum + 2}`}>
            <p className="font-bold text-blue-700 mb-2">
                Bước {startStepNum + 2}: Tính kết quả cuối (Nhân các giá trị
                được lấy):
            </p>
            <p className="ml-4 font-mono text-gray-800">
                Kết quả = ({activeValues.join(" × ")}) mod {N.toString()} ={" "}
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

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
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
                                1. TÍNH LŨY THỪA MODULO b = a^m mod n BẰNG HẠ BẬC
                            </option>
                            <option value={2}>
                                2. TÌM NGHỊCH ĐẢO x = a⁻¹ mod n THEO BẢNG EUCLID
                            </option>
                            <option value={3}>
                                3. ĐỊNH LÝ FERMAT: TÍNH LŨY THỪA MODULO b = a^m mod n
                            </option>
                            <option value={4}>
                                4. TÍNH GIÁ TRỊ HÀM EULER φ(n)
                            </option>
                            <option disabled>
                                --- Các bài tiếp theo chờ confirm UI ---
                            </option>
                        </select>
                    </div>

                    <form className="space-y-6">
                        {/* FORM BÀI 1 */}
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
                                                    1,
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
                                            const a = BigInt(b2A);
                                            const n = BigInt(b2N);
                                            let logs: React.ReactNode[] = [];
                                            logs.push(
                                                <p
                                                    key="1"
                                                    className="mb-4 text-gray-800"
                                                >
                                                    Phân tích thuật toán Euclid
                                                    mở rộng cho{" "}
                                                    <b>a = {a.toString()}</b>,{" "}
                                                    <b>n = {n.toString()}</b>:
                                                </p>,
                                            );

                                            let A1 = BigInt(1),
                                                A2 = BigInt(0),
                                                A3 = n;
                                            let B1 = BigInt(0),
                                                B2 = BigInt(1),
                                                B3 = a % n;
                                            let steps = [];
                                            steps.push({
                                                Q: "-",
                                                A1,
                                                A2,
                                                A3,
                                                B1,
                                                B2,
                                                B3,
                                            });

                                            while (
                                                B3 > BigInt(0) &&
                                                B3 !== BigInt(1)
                                            ) {
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
                                                steps.push({
                                                    Q,
                                                    A1,
                                                    A2,
                                                    A3,
                                                    B1,
                                                    B2,
                                                    B3,
                                                });
                                            }

                                            logs.push(
                                                <div
                                                    key="table"
                                                    className="overflow-x-auto mt-2 border border-gray-300 rounded shadow-sm"
                                                >
                                                    <table className="min-w-full text-center bg-white font-mono text-sm">
                                                        <thead className="bg-gray-100 text-gray-700 border-b">
                                                            <tr>
                                                                <th className="py-3">
                                                                    Q
                                                                </th>
                                                                <th>A1</th>
                                                                <th>A2</th>
                                                                <th>A3</th>
                                                                <th>B1</th>
                                                                <th>B2</th>
                                                                <th>B3</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="text-gray-600">
                                                            {steps.map(
                                                                (s, i) => (
                                                                    <tr
                                                                        key={i}
                                                                        className="border-b border-gray-100 hover:bg-gray-50"
                                                                    >
                                                                        <td className="py-2">
                                                                            {s.Q.toString()}
                                                                        </td>
                                                                        <td>
                                                                            {s.A1.toString()}
                                                                        </td>
                                                                        <td>
                                                                            {s.A2.toString()}
                                                                        </td>
                                                                        <td>
                                                                            {s.A3.toString()}
                                                                        </td>
                                                                        <td>
                                                                            {s.B1.toString()}
                                                                        </td>
                                                                        <td className="font-bold text-green-600">
                                                                            {s.B2.toString()}
                                                                        </td>
                                                                        <td className="font-bold text-purple-600">
                                                                            {s.B3.toString()}
                                                                        </td>
                                                                    </tr>
                                                                ),
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>,
                                            );
                                            if (B3 === BigInt(1)) {
                                                let inverse =
                                                    ((B2 % n) + n) % n;
                                                logs.push(
                                                    <p
                                                        key="ok"
                                                        className="mt-4 text-gray-800"
                                                    >
                                                        Vì B3 = 1, nên kết quả
                                                        nghịch đảo là B2 mod n ={" "}
                                                        {B2.toString()} mod{" "}
                                                        {n.toString()} ={" "}
                                                        <b className="text-lg text-emerald-600">
                                                            {inverse.toString()}
                                                        </b>
                                                    </p>,
                                                );
                                                return {
                                                    res: inverse.toString(),
                                                    log: logs,
                                                };
                                            } else {
                                                logs.push(
                                                    <p
                                                        key="e"
                                                        className="text-red-600 mt-4 font-bold"
                                                    >
                                                        Dừng vì B3 = 0. Không
                                                        tồn tại nghịch đảo!
                                                    </p>,
                                                );
                                                return {
                                                    res: "Vô nghiệm",
                                                    log: logs,
                                                };
                                            }
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
                                                    2,
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
                                            const phiData =
                                                eulerPhiWithDetails(n);
                                            let logs: React.ReactNode[] = [];

                                            // Tạo chuỗi phân tích lũy thừa (VD: 2^4 x 277)
                                            const primeStr = phiData.factors
                                                .map((f) =>
                                                    f.exp > 1
                                                        ? `${f.base}<sup>${f.exp}</sup>`
                                                        : `${f.base}`,
                                                )
                                                .join(" × ");

                                            // Tạo chuỗi công thức (VD: (1 - 1/2) x (1 - 1/277))
                                            const formulaStr = phiData.factors
                                                .map(
                                                    (f) =>
                                                        `(1 - 1/${f.base})`,
                                                )
                                                .join(" × ");

                                            logs.push(
                                                <div
                                                    key="step1"
                                                    className="mb-4 text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 1: Phân tích ra
                                                        thừa số nguyên tố
                                                    </p>
                                                    <p className="ml-4 font-mono bg-gray-50 p-3 rounded border inline-block">
                                                        {n.toString()} ={" "}
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html: primeStr,
                                                            }}
                                                        ></span>
                                                    </p>
                                                </div>,
                                            );

                                            logs.push(
                                                <div
                                                    key="step2"
                                                    className="text-gray-800"
                                                >
                                                    <p className="font-bold text-blue-700 mb-2">
                                                        Bước 2: Áp dụng công
                                                        thức Euler
                                                    </p>
                                                    <div className="ml-4 space-y-2">
                                                        <p>
                                                            φ(n) = n × (1 - 1/p
                                                            <sub>1</sub>) × (1 -
                                                            1/p<sub>2</sub>)...
                                                        </p>
                                                        <p>
                                                            ➔ φ({n.toString()})
                                                            = {n.toString()} ×{" "}
                                                            {formulaStr}
                                                        </p>
                                                        <p>
                                                            ➔ φ({n.toString()})
                                                            ={" "}
                                                            <b className="text-lg text-purple-600">
                                                                {phiData.phi.toString()}
                                                            </b>
                                                        </p>
                                                    </div>
                                                </div>,
                                            );

                                            return {
                                                res: phiData.phi.toString(),
                                                log: logs,
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