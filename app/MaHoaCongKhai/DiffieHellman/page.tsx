"use client";

import React, { useState } from "react";

// --- HÀM HỖ TRỢ: HẠ BẬC BÌNH PHƯƠNG VÀ NHÂN ---
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
            className="mb-3 p-3 bg-gray-50 border rounded-lg shadow-sm"
        >
            <p className={`font-bold ${colorClass} mb-2`}>
                {titlePrefix} - Phân tích số mũ {M_val.toString()} ra nhị phân:
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
            <p className={`font-bold ${colorClass} mb-2`}>
                Tiến hành hạ bậc bình phương liên tiếp:
            </p>
            <div className="space-y-1 font-mono text-sm">{tableLogs}</div>
            <p className="mt-3 font-mono text-gray-800">
                ➔ Kết quả = ({activeValues.join(" × ")}) mod {N.toString()} ={" "}
                <b className={colorClass}>{finalRes.toString()}</b>
            </p>
        </div>,
    );

    return { resStr: finalRes.toString(), logNodes: logs };
};

export default function DiffieHellman() {
    // Toggle Mode
    const [isStandardMode, setIsStandardMode] = useState(true);

    // States Mode 1 (Tiêu chuẩn)
    const [q, setQ] = useState("7669");
    const [a, setA] = useState("6");
    const [xA, setXA] = useState("338");
    const [xB, setXB] = useState("336");

    // States Mode 2 (Giải mã/Hack)
    const [yHack, setYHack] = useState("105");

    const [logs, setLogs] = useState<React.ReactNode[]>([]);
    const [result, setResult] = useState<any>(null);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!q || !a)
                throw new Error("Vui lòng nhập tham số chung q và a.");
            const q_val = BigInt(q);
            const a_val = BigInt(a);
            let allLogs: React.ReactNode[] = [];

            if (isStandardMode) {
                // ================= CHẾ ĐỘ TIÊU CHUẨN =================
                if (!xA || !xB)
                    throw new Error("Vui lòng nhập khóa riêng xA và xB.");
                const xa_val = BigInt(xA);
                const xb_val = BigInt(xB);

                // Tính yA
                const step1 = generateExponentiationSteps(
                    a_val,
                    xa_val,
                    q_val,
                    "1. An tính khóa công khai yA",
                    "text-sky-600",
                );
                const yA = BigInt(step1.resStr);
                allLogs.push(
                    <div
                        key="s1"
                        className="mb-6 p-4 border-l-4 border-sky-500 bg-white shadow-sm rounded"
                    >
                        {step1.logNodes}
                    </div>,
                );

                // Tính yB
                const step2 = generateExponentiationSteps(
                    a_val,
                    xb_val,
                    q_val,
                    "2. Ba tính khóa công khai yB",
                    "text-emerald-600",
                );
                const yB = BigInt(step2.resStr);
                allLogs.push(
                    <div
                        key="s2"
                        className="mb-6 p-4 border-l-4 border-emerald-500 bg-white shadow-sm rounded"
                    >
                        {step2.logNodes}
                    </div>,
                );

                // Tính K_A
                const step3 = generateExponentiationSteps(
                    yB,
                    xa_val,
                    q_val,
                    "3. An tính khóa phiên K",
                    "text-purple-600",
                );
                const K_A = step3.resStr;
                allLogs.push(
                    <div
                        key="s3"
                        className="mb-6 p-4 border-l-4 border-purple-500 bg-white shadow-sm rounded"
                    >
                        {step3.logNodes}
                    </div>,
                );

                // Tính K_B
                const step4 = generateExponentiationSteps(
                    yA,
                    xb_val,
                    q_val,
                    "4. Ba tính khóa phiên K",
                    "text-fuchsia-600",
                );
                const K_B = step4.resStr;
                allLogs.push(
                    <div
                        key="s4"
                        className="mb-6 p-4 border-l-4 border-fuchsia-500 bg-white shadow-sm rounded"
                    >
                        {step4.logNodes}
                    </div>,
                );

                if (K_A !== K_B) {
                    allLogs.push(
                        <div
                            key="err"
                            className="p-4 bg-red-100 text-red-700 font-bold rounded"
                        >
                            LỖI: Khóa phiên K không khớp!
                        </div>,
                    );
                } else {
                    allLogs.push(
                        <div
                            key="succ"
                            className="p-4 bg-green-100 text-green-800 font-bold rounded text-center text-xl border border-green-300"
                        >
                            🎉 Khóa phiên chung: K = {K_A}
                        </div>,
                    );
                }

                setResult({
                    type: "standard",
                    yA: yA.toString(),
                    yB: yB.toString(),
                    K: K_A,
                });
            } else {
                // ================= CHẾ ĐỘ TÌM KHÓA RIÊNG (HACK/DLP) =================
                if (!yHack)
                    throw new Error(
                        "Vui lòng nhập Khóa Công Khai (y) cần giải mã.",
                    );
                const y_val = BigInt(yHack);

                allLogs.push(
                    <div key="dlp_title" className="mb-4 text-gray-800">
                        <p className="font-bold text-amber-700 mb-2">
                            Tìm Khóa Riêng (x) sao cho: {a_val.toString()}
                            <sup>x</sup> ≡ {y_val.toString()} (mod{" "}
                            {q_val.toString()})
                        </p>
                        <p className="italic text-sm text-gray-600">
                            Thuật toán thử tuần tự từ x = 1 đến q-1
                        </p>
                    </div>,
                );

                let found_x = BigInt(-1);
                let current_val = a_val % q_val;
                let calcLogs: React.ReactNode[] = [];
                const MAX_DOM_LOGS = 20; // Chỉ in 20 bước đầu để tránh lag trình duyệt

                for (let x = BigInt(1); x < q_val; x++) {
                    if (x > BigInt(1)) {
                        current_val = (current_val * a_val) % q_val;
                    }

                    // Tối ưu DOM: Chỉ log một số bước đầu hoặc khi tìm thấy kết quả
                    if (x <= BigInt(MAX_DOM_LOGS) || current_val === y_val) {
                        calcLogs.push(
                            <div
                                key={`x_${x}`}
                                className="ml-4 mb-2 p-2 border border-gray-200 rounded bg-gray-50 font-mono text-sm flex items-center justify-between"
                            >
                                <span>
                                    x = {x.toString()}: {a_val.toString()}
                                    <sup>{x.toString()}</sup> mod{" "}
                                    {q_val.toString()} =
                                </span>
                                <b
                                    className={`ml-2 ${current_val === y_val ? "text-green-600 text-base" : "text-gray-700"}`}
                                >
                                    {current_val.toString()}
                                </b>
                                {current_val === y_val && (
                                    <span className="ml-2 text-green-600 font-bold uppercase text-xs">
                                        ➔ Đã tìm thấy!
                                    </span>
                                )}
                            </div>,
                        );
                    } else if (x === BigInt(MAX_DOM_LOGS) + BigInt(1)) {
                        calcLogs.push(
                            <div
                                key="dots"
                                className="ml-8 my-3 text-gray-400 font-bold tracking-widest"
                            >
                                . . . (Bỏ qua hiển thị các bước trung gian để
                                tránh giật lag) . . .
                            </div>,
                        );
                    }

                    if (current_val === y_val) {
                        found_x = x;
                        break;
                    }
                }

                allLogs.push(
                    <div key="calc_wrapper" className="mb-4">
                        {calcLogs}
                    </div>,
                );

                if (found_x !== BigInt(-1)) {
                    allLogs.push(
                        <div
                            key="succ"
                            className="mt-4 p-4 bg-green-50 border border-green-200 rounded text-center"
                        >
                            <p className="text-xl font-bold text-green-700">
                                Khóa Riêng cần tìm là: x = {found_x.toString()}
                            </p>
                        </div>,
                    );
                    setResult({ type: "hack", foundX: found_x.toString() });
                } else {
                    allLogs.push(
                        <div
                            key="err"
                            className="mt-4 p-4 bg-red-50 border border-red-200 rounded text-center"
                        >
                            <p className="text-xl font-bold text-red-700">
                                Không tìm thấy x thỏa mãn!
                            </p>
                        </div>,
                    );
                    setResult({ type: "error" });
                }
            }

            setLogs(allLogs);
        } catch (error: any) {
            alert("Lỗi: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-center">
                    <h1 className="text-3xl font-extrabold text-white">
                        Trao Đổi Khóa Diffie-Hellman 🔐
                    </h1>
                    <p className="text-blue-100 mt-2">
                        Mô phỏng quy trình tạo khóa và kỹ thuật tìm ngược Khóa
                        Riêng
                    </p>
                </div>

                <div className="p-6 sm:p-10 space-y-8">
                    {/* TOGGLE CHẾ ĐỘ */}
                    <div className="flex bg-gray-100 rounded-lg p-1 max-w-md mx-auto shadow-inner">
                        <button
                            onClick={() => {
                                setIsStandardMode(true);
                                setLogs([]);
                                setResult(null);
                            }}
                            className={`w-1/2 py-3 rounded-md font-bold transition-all ${
                                isStandardMode
                                    ? "bg-indigo-500 text-white shadow-md"
                                    : "text-gray-800 hover:bg-gray-200"
                            }`}
                        >
                            Tạo Khóa (Chuẩn)
                        </button>
                        <button
                            onClick={() => {
                                setIsStandardMode(false);
                                setLogs([]);
                                setResult(null);
                            }}
                            className={`w-1/2 py-3 rounded-md font-bold transition-all ${
                                !isStandardMode
                                    ? "bg-amber-500 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            Tìm Khóa Riêng (Hack)
                        </button>
                    </div>

                    {/* FORM NHẬP LIỆU */}
                    <form onSubmit={handleCalculate} className="space-y-6">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                            <h3 className="font-bold text-gray-700 uppercase border-b border-gray-300 pb-2 mb-4">
                                Tham số công khai chung
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex flex-col">
                                    <label className="text-sm font-bold text-gray-600 mb-1">
                                        Số nguyên tố (q)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={q}
                                        onChange={(e) =>
                                            setQ(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                                            setA(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {isStandardMode ? (
                            <div className="bg-sky-50 p-6 rounded-xl border border-sky-200">
                                <h3 className="font-bold text-sky-800 uppercase border-b border-sky-300 pb-2 mb-4">
                                    Khóa Riêng (Bí mật)
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-sky-700 mb-1">
                                            Khóa riêng của An (xA)
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
                                            className="border border-sky-300 p-2.5 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-sm font-bold text-emerald-700 mb-1">
                                            Khóa riêng của Ba (xB)
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={xB}
                                            onChange={(e) =>
                                                setXB(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className="border border-emerald-300 p-2.5 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                                <h3 className="font-bold text-amber-800 uppercase border-b border-amber-300 pb-2 mb-4 text-center">
                                    Tìm Khóa Riêng Từ Khóa Công Khai
                                </h3>
                                <div className="flex flex-col max-w-sm mx-auto">
                                    <label className="text-sm font-bold text-amber-700 mb-2 text-center">
                                        Khóa Công Khai đã biết (y)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={yHack}
                                        onChange={(e) =>
                                            setYHack(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        className="border border-amber-300 p-3 rounded-lg focus:ring-2 focus:ring-amber-400 focus:outline-none text-center font-bold text-xl text-amber-900"
                                        placeholder="VD: 105"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className={`w-full text-white font-bold py-4 rounded-xl transition shadow-lg uppercase tracking-wide hover:-translate-y-0.5 ${
                                isStandardMode
                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                    : "bg-amber-600 hover:bg-amber-700"
                            }`}
                        >
                            {isStandardMode
                                ? "Bắt Đầu Mô Phỏng Trao Đổi Khóa"
                                : "Chạy Thuật Toán Tìm Khóa Riêng (DLP)"}
                        </button>
                    </form>

                    {/* KẾT QUẢ RÚT GỌN */}
                    {result && result.type === "standard" && (
                        <div className="bg-yellow-50 border border-yellow-300 p-6 rounded-xl shadow-sm text-center">
                            <h2 className="text-xl font-bold text-yellow-800 mb-4">
                                🔑 KẾT QUẢ ĐÁP ÁN
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-lg">
                                <div className="p-3 bg-white border border-yellow-200 rounded">
                                    <p className="text-sky-700 font-bold mb-2">
                                        a) Của An
                                    </p>
                                    <p>yA = {result.yA}</p>
                                    <p>K = {result.K}</p>
                                </div>
                                <div className="p-3 bg-white border border-yellow-200 rounded">
                                    <p className="text-emerald-700 font-bold mb-2">
                                        b) Của Ba
                                    </p>
                                    <p>yB = {result.yB}</p>
                                    <p>K = {result.K}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {result && result.type === "hack" && (
                        <div className="bg-green-50 border-2 border-green-400 p-6 rounded-xl shadow-sm text-center">
                            <h2 className="text-xl font-bold text-green-800 mb-2 uppercase">
                                🎯 Phá Khóa Thành Công
                            </h2>
                            <p className="text-gray-700 text-lg">
                                Khóa riêng bí mật tương ứng là:
                            </p>
                            <p className="text-4xl font-extrabold text-green-600 mt-2 font-mono">
                                x = {result.foundX}
                            </p>
                        </div>
                    )}

                    {/* LOGS CHI TIẾT */}
                    {logs.length > 0 && (
                        <div className="mt-12 pt-8 border-t-2 border-gray-200">
                            <h2
                                className={`text-2xl font-bold mb-8 border-l-4 pl-4 uppercase ${isStandardMode ? "text-gray-800 border-indigo-500" : "text-amber-800 border-amber-500"}`}
                            >
                                📝 GIẢI THÍCH CHI TIẾT TỪNG BƯỚC
                            </h2>
                            <div className="space-y-6">{logs}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
