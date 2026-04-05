"use client";

import React, { useState } from "react";

// --- HÀM HỖ TRỢ 1: EUCLID MỞ RỘNG (TÌM NGHỊCH ĐẢO d) ---
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
                    ➔ Nghịch đảo d = B2 mod φ(n) = {B2.toString()} mod{" "}
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

export default function RSA() {
    // Chế độ Toggle (Mã hóa = true, Giải mã = false)
    const [maHoaMode, setMaHoaMode] = useState(true);

    // State dùng chung
    const [p, setP] = useState("19");
    const [q, setQ] = useState("23");
    const [eVal, setEVal] = useState("31");

    // State cho 2 chế độ
    const [M, setM] = useState("41");
    const [C, setC] = useState("");

    const [logs, setLogs] = useState<React.ReactNode[]>([]);
    const [result, setResult] = useState<any>(null);

    // Xử lý chung khi submit form
    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!p || !q || !eVal) throw new Error("Vui lòng nhập đủ p, q, e");
            if (maHoaMode && !M) throw new Error("Vui lòng nhập Bản rõ M");
            if (!maHoaMode && !C) throw new Error("Vui lòng nhập Bản mã C");

            const p_bn = BigInt(p);
            const q_bn = BigInt(q);
            const e_bn = BigInt(eVal);

            let allLogs: React.ReactNode[] = [];

            // --- BƯỚC 1: TÍNH n và φ(n) (DÙNG CHUNG) ---
            const n_bn = p_bn * q_bn;
            const phi_n = (p_bn - BigInt(1)) * (q_bn - BigInt(1));

            allLogs.push(
                <div
                    key="step1"
                    className="mb-8 p-5 border-l-4 border-indigo-500 bg-white shadow-sm rounded-lg"
                >
                    <h3 className="font-bold text-xl text-indigo-700 mb-4 uppercase">
                        1. Tính các giá trị cơ bản n và φ(n)
                    </h3>
                    <div className="ml-4 space-y-2 text-gray-700 font-mono text-lg bg-gray-50 p-4 rounded border border-gray-200">
                        <p>
                            n = p × q = {p_bn.toString()} × {q_bn.toString()} ={" "}
                            <b className="text-indigo-600">{n_bn.toString()}</b>
                        </p>
                        <p>
                            φ(n) = (p - 1) × (q - 1) ={" "}
                            {(p_bn - BigInt(1)).toString()} ×{" "}
                            {(q_bn - BigInt(1)).toString()} ={" "}
                            <b className="text-indigo-600">
                                {phi_n.toString()}
                            </b>
                        </p>
                    </div>
                </div>,
            );

            // --- BƯỚC 2: TÌM KHÓA RIÊNG d (DÙNG CHUNG) ---
            const { inverse: d_bn, logNodes: euclidLogs } = generateEuclidSteps(
                e_bn,
                phi_n,
                `Tìm khóa riêng d ≡ e⁻¹ mod φ(n) ➔ d ≡ ${e_bn.toString()}⁻¹ mod ${phi_n.toString()}`,
            );
            if (d_bn === BigInt(-1))
                throw new Error(
                    "Không thể tìm được d vì e và φ(n) không nguyên tố cùng nhau!",
                );

            allLogs.push(
                <div
                    key="step2"
                    className="mb-8 p-5 border-l-4 border-teal-500 bg-white shadow-sm rounded-lg"
                >
                    <h3 className="font-bold text-xl text-teal-700 mb-4 uppercase">
                        2. Tìm Khóa Riêng (d) bằng Euclid mở rộng
                    </h3>
                    {euclidLogs}
                </div>,
            );

            if (maHoaMode) {
                // =============== CHẾ ĐỘ MÃ HÓA ===============
                const M_bn = BigInt(M);
                const encSteps = generateExponentiationSteps(
                    M_bn,
                    e_bn,
                    n_bn,
                    `Mã hóa bản rõ M = ${M_bn.toString()}`,
                    "text-rose-600",
                );
                const C_bn = BigInt(encSteps.resStr);

                allLogs.push(
                    <div
                        key="encryption"
                        className="mb-8 p-5 border-l-4 border-rose-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-rose-700 mb-4 uppercase">
                            3. Tạo bản mã C (Mã hóa)
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Công thức RSA:{" "}
                            <b>
                                C = M<sup>e</sup> mod n
                            </b>
                        </p>
                        {encSteps.logNodes}
                        <div className="mt-4 p-4 bg-rose-50 rounded border border-rose-200 text-center">
                            <p className="text-xl font-bold text-rose-800">
                                ➔ Bản mã thu được: C = {C_bn.toString()}
                            </p>
                        </div>
                    </div>,
                );

                setResult({
                    type: "mahoa",
                    PU: `{${e_bn.toString()}, ${n_bn.toString()}}`,
                    PR: `{${d_bn.toString()}, ${n_bn.toString()}}`,
                    finalVal: C_bn.toString(),
                    label: "Bản mã (C)",
                });
            } else {
                // =============== CHẾ ĐỘ GIẢI MÃ ===============
                const C_bn = BigInt(C);
                const decSteps = generateExponentiationSteps(
                    C_bn,
                    d_bn,
                    n_bn,
                    `Giải mã bản mã C = ${C_bn.toString()}`,
                    "text-amber-600",
                );
                const M_decrypted = BigInt(decSteps.resStr);

                allLogs.push(
                    <div
                        key="decryption"
                        className="mb-8 p-5 border-l-4 border-amber-500 bg-white shadow-sm rounded-lg"
                    >
                        <h3 className="font-bold text-xl text-amber-700 mb-4 uppercase">
                            3. Phục hồi bản rõ M (Giải mã)
                        </h3>
                        <p className="mb-3 text-gray-700">
                            Công thức RSA:{" "}
                            <b>
                                M = C<sup>d</sup> mod n
                            </b>
                        </p>
                        {decSteps.logNodes}
                        <div className="mt-4 p-4 bg-amber-50 rounded border border-amber-200 text-center">
                            <p className="text-xl font-bold text-amber-800">
                                ➔ Thông điệp gốc phục hồi được: M ={" "}
                                {M_decrypted.toString()}
                            </p>
                        </div>
                    </div>,
                );

                setResult({
                    type: "giaima",
                    PU: `{${e_bn.toString()}, ${n_bn.toString()}}`,
                    PR: `{${d_bn.toString()}, ${n_bn.toString()}}`,
                    finalVal: M_decrypted.toString(),
                    label: "Bản rõ (M)",
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
                        Thuật toán RSA 🛡️
                    </h1>
                    <p className="text-gray-500">
                        Hỗ trợ đầy đủ Tạo Khóa - Mã Hóa - Giải Mã
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
                        🔓 Đề cho Bản rõ (Tạo M)
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
                        🔐 Đề cho Bản mã (Tìm M)
                    </button>
                </div>

                {/* FORM NHẬP LIỆU */}
                <form onSubmit={handleCalculate} className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-700 uppercase border-b border-gray-300 pb-2 mb-4">
                            Thông số Public/Private Key
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
                                    Mũ công khai (e)
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={eVal}
                                    onChange={(e) =>
                                        setEVal(
                                            e.target.value.replace(/\D/g, ""),
                                        )
                                    }
                                    className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className={`p-6 rounded-xl border transition-colors duration-300 ${maHoaMode ? "bg-rose-50 border-rose-200" : "bg-amber-50 border-amber-200"}`}
                    >
                        <div className="flex flex-col max-w-sm mx-auto">
                            <label
                                className={`text-sm font-bold mb-2 uppercase text-center ${maHoaMode ? "text-rose-700" : "text-amber-700"}`}
                            >
                                {maHoaMode
                                    ? "Nhập thông điệp cần mã hóa (M)"
                                    : "Nhập bản mã cần giải (C)"}
                            </label>
                            <input
                                required
                                type="text"
                                value={maHoaMode ? M : C}
                                onChange={(e) => {
                                    if (maHoaMode)
                                        setM(e.target.value.replace(/\D/g, ""));
                                    else
                                        setC(e.target.value.replace(/\D/g, ""));
                                }}
                                className={`border p-3 rounded-lg focus:ring-2 focus:outline-none text-center font-bold text-xl tracking-wider shadow-inner ${
                                    maHoaMode
                                        ? "border-rose-300 focus:ring-rose-400 text-rose-800"
                                        : "border-amber-300 focus:ring-amber-400 text-amber-800"
                                }`}
                                placeholder={maHoaMode ? "VD: 41" : "VD: 105"}
                            />
                        </div>
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
                            ? "Thực Hiện Mã Hóa RSA"
                            : "Thực Hiện Giải Mã RSA"}
                    </button>
                </form>

                {/* KẾT QUẢ RÚT GỌN TÓM TẮT ĐÁP ÁN */}
                {result && (
                    <div className="bg-gray-800 border-2 border-gray-900 p-6 rounded-xl shadow-lg text-center mt-8">
                        <h2 className="text-xl font-bold text-yellow-400 mb-4 uppercase tracking-widest">
                            🎯 Tóm tắt đáp án
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-lg">
                            <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-inner">
                                <p className="text-gray-300 font-bold mb-2 text-sm uppercase">
                                    Khóa Công Khai (PU)
                                </p>
                                <p className="text-white">{result.PU}</p>
                            </div>
                            <div className="p-4 bg-gray-700 border border-gray-600 rounded-lg shadow-inner">
                                <p className="text-gray-300 font-bold mb-2 text-sm uppercase">
                                    Khóa Riêng (PR)
                                </p>
                                <p className="text-white">{result.PR}</p>
                            </div>
                            <div
                                className={`p-4 border rounded-lg shadow-inner ${maHoaMode ? "bg-rose-900 border-rose-700" : "bg-amber-900 border-amber-700"}`}
                            >
                                <p
                                    className={`font-bold mb-2 text-sm uppercase ${maHoaMode ? "text-rose-300" : "text-amber-300"}`}
                                >
                                    Kết quả {result.label}
                                </p>
                                <p className="text-white text-2xl font-extrabold">
                                    {result.finalVal}
                                </p>
                            </div>
                        </div>
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
