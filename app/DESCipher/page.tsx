"use client";

import React, { useState } from "react";

// ==========================================
// CÁC BẢNG CHUẨN CỦA THUẬT TOÁN DES
// ==========================================
const PC1 = [
    57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35,
    27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46,
    38, 30, 22, 14, 6, 61, 53, 45, 37, 29, 21, 13, 5, 28, 20, 12, 4,
];

const PC2 = [
    14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27,
    20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56,
    34, 53, 46, 42, 50, 36, 29, 32,
];

const SHIFT_LEFT = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

const IP = [
    58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46,
    38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9,
    1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47,
    39, 31, 23, 15, 7,
];

const IP_INV = [
    40, 8, 48, 16, 56, 24, 64, 32, 39, 7, 47, 15, 55, 23, 63, 31, 38, 6, 46, 14,
    54, 22, 62, 30, 37, 5, 45, 13, 53, 21, 61, 29, 36, 4, 44, 12, 52, 20, 60,
    28, 35, 3, 43, 11, 51, 19, 59, 27, 34, 2, 42, 10, 50, 18, 58, 26, 33, 1, 41,
    9, 49, 17, 57, 25,
];

const E = [
    32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15,
    16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28,
    29, 28, 29, 30, 31, 32, 1,
];

const P = [
    16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14,
    32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25,
];

const S_BOXES = [
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13],
    ],
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9],
    ],
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12],
    ],
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14],
    ],
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3],
    ],
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13],
    ],
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12],
    ],
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11],
    ],
];

// ==========================================
// HÀM HỖ TRỢ XỬ LÝ NHỊ PHÂN
// ==========================================
const hexToBin = (hex: string): string => {
    return hex
        .split("")
        .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
        .join("");
};

const binToHex = (bin: string): string => {
    let hex = "";
    for (let i = 0; i < bin.length; i += 4) {
        hex += parseInt(bin.substr(i, 4), 2).toString(16).toUpperCase();
    }
    return hex;
};

const permute = (input: string, table: number[]): string => {
    return table.map((idx) => input[idx - 1]).join("");
};

const leftShift = (input: string, shifts: number): string => {
    return input.slice(shifts) + input.slice(0, shifts);
};

const xor = (a: string, b: string): string => {
    return a
        .split("")
        .map((bit, i) => (bit === b[i] ? "0" : "1"))
        .join("");
};

const sboxSubstitute = (input: string): { output: string; details: any[] } => {
    let output = "";
    let details = [];
    for (let i = 0; i < 8; i++) {
        const block = input.substr(i * 6, 6);
        const row = parseInt(block[0] + block[5], 2);
        const col = parseInt(block.slice(1, 5), 2);
        const val = S_BOXES[i][row][col];
        const binVal = val.toString(2).padStart(4, "0");
        details.push({ block, row, col, val, binVal, sbox: i + 1 });
        output += binVal;
    }
    return { output, details };
};

// ==========================================
// COMPONENT CHÍNH
// ==========================================
export default function DESCipher() {
    const [keyHex, setKeyHex] = useState("E35CB18E63EEED18");
    const [msgHex, setMsgHex] = useState("B71127D233E316C3");
    const [logs, setLogs] = useState<React.ReactNode[]>([]);
    const [finalCipher, setFinalCipher] = useState("");
    const [showTables, setShowTables] = useState(false);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let traceLogs: React.ReactNode[] = [];

            if (keyHex.length !== 16 || msgHex.length !== 16) {
                throw new Error(
                    "Key và Message phải dài đúng 16 ký tự Hex (64 bits).",
                );
            }

            const K_bin = hexToBin(keyHex);
            const M_bin = hexToBin(msgHex);

            // LOG ĐẦU VÀO
            traceLogs.push(
                <div
                    key="init"
                    className="mb-6 p-4 bg-slate-100 border-2 border-slate-300 rounded-lg shadow-sm"
                >
                    <p className="font-bold text-black mb-2 border-b-2 border-slate-300 pb-2 text-base">
                        Dữ Liệu Đầu Vào (Nhị phân 64-bit):
                    </p>
                    <div className="font-mono text-base break-all space-y-2">
                        <p className="text-black font-semibold bg-white p-2 border border-slate-300 rounded">
                            <span className="font-bold text-blue-700">K</span> ={" "}
                            {K_bin}
                        </p>
                        <p className="text-black font-semibold bg-white p-2 border border-slate-300 rounded">
                            <span className="font-bold text-red-700">M</span> ={" "}
                            {M_bin}
                        </p>
                    </div>
                </div>,
            );

            // ==========================================
            // PHẦN 1: SINH KHÓA
            // ==========================================
            traceLogs.push(
                <h3
                    key="h_p1"
                    className="text-xl font-bold text-black mt-8 mb-4 border-l-4 border-blue-600 pl-3 bg-blue-50 py-2 rounded-r"
                >
                    Phần 1: Sinh Khóa Ki (Chi tiết 16 Vòng)
                </h3>,
            );

            // B1: PC1
            const K_plus = permute(K_bin, PC1);
            let C = K_plus.slice(0, 28);
            let D = K_plus.slice(28, 56);

            traceLogs.push(
                <div key="p1_b1" className="mb-6 text-base">
                    <p className="font-bold text-black mb-2">
                        1. Tính hoán vị PC1 đối với khóa K:
                    </p>
                    <div className="ml-4 font-mono bg-white p-3 rounded-lg border-2 border-slate-300 space-y-2 text-black shadow-sm">
                        <p>
                            <span className="font-bold text-blue-800">
                                K_plus
                            </span>{" "}
                            = PC1(K) = {K_plus}
                        </p>
                        <p>
                            <span className="font-bold text-blue-800">C₀</span>{" "}
                            ={" "}
                            <span className="font-semibold text-slate-800">
                                {C}
                            </span>
                        </p>
                        <p>
                            <span className="font-bold text-blue-800">D₀</span>{" "}
                            ={" "}
                            <span className="font-semibold text-slate-800">
                                {D}
                            </span>
                        </p>
                    </div>
                </div>,
            );

            // Sinh 16 khóa
            let keys = [];
            traceLogs.push(
                <p
                    key="t_p1"
                    className="font-bold text-black text-base mt-6 mb-3"
                >
                    2 & 3. Dịch vòng và tính khóa Kᵢ cho 16 vòng:
                </p>,
            );

            for (let i = 0; i < 16; i++) {
                C = leftShift(C, SHIFT_LEFT[i]);
                D = leftShift(D, SHIFT_LEFT[i]);
                const Ki = permute(C + D, PC2);
                keys.push(Ki);

                traceLogs.push(
                    <div
                        key={`p1_r${i}`}
                        className="ml-4 mb-4 border-l-4 border-blue-400 bg-slate-50 p-3 rounded-r-lg shadow-sm border-y border-r border-slate-300 text-base"
                    >
                        <p className="font-bold text-black mb-2 flex items-center">
                            <span className="bg-blue-200 text-blue-900 px-2 py-1 rounded mr-2 text-sm uppercase tracking-wider">
                                Vòng {i + 1}
                            </span>
                            <span className="text-slate-700 text-sm font-semibold">
                                (Dịch trái {SHIFT_LEFT[i]} bit)
                            </span>
                        </p>
                        <div className="font-mono space-y-1 text-black ml-1 font-semibold">
                            <p>
                                C<sub className="font-bold">{i + 1}</sub> = {C}
                            </p>
                            <p>
                                D<sub className="font-bold">{i + 1}</sub> = {D}
                            </p>
                            <div className="mt-3 pt-3 border-t-2 border-slate-200 bg-white p-2 rounded border border-slate-300">
                                <p className="text-black break-all">
                                    K<sub className="font-bold">{i + 1}</sub> =
                                    PC2(C
                                    <sub className="font-bold">{i + 1}</sub>D
                                    <sub className="font-bold">{i + 1}</sub>) ={" "}
                                    <span className="text-blue-700 font-bold text-lg">
                                        {Ki}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>,
                );
            }

            // ==========================================
            // PHẦN 2: MÃ HÓA
            // ==========================================
            traceLogs.push(
                <h3
                    key="h_p2"
                    className="text-xl font-bold text-black mt-10 mb-4 border-l-4 border-red-600 pl-3 bg-red-50 py-2 rounded-r"
                >
                    Phần 2: Mã Hóa Bản Rõ M (Chi tiết 16 Vòng)
                </h3>,
            );

            // B4: IP
            const IP_M = permute(M_bin, IP);
            let L = IP_M.slice(0, 32);
            let R = IP_M.slice(32, 64);

            traceLogs.push(
                <div key="p2_b4" className="mb-6 text-base">
                    <p className="font-bold text-black mb-2">
                        4. Tính hoán vị IP đối với bản tin M:
                    </p>
                    <div className="ml-4 font-mono bg-white p-3 rounded-lg border-2 border-slate-300 space-y-2 text-black shadow-sm">
                        <p>
                            <span className="font-bold text-red-800">
                                IP(M)
                            </span>{" "}
                            = {IP_M}
                        </p>
                        <p>
                            <span className="font-bold text-red-800">L₀</span> ={" "}
                            <span className="font-semibold text-slate-800">
                                {L}
                            </span>
                        </p>
                        <p>
                            <span className="font-bold text-red-800">R₀</span> ={" "}
                            <span className="font-semibold text-slate-800">
                                {R}
                            </span>
                        </p>
                    </div>
                </div>,
            );

            let L_prev = L;
            let R_prev = R;
            let summaryTableData = [];

            for (let i = 0; i < 16; i++) {
                const E_R = permute(R_prev, E);
                const A = xor(E_R, keys[i]);
                const { output: B, details: sboxDetails } = sboxSubstitute(A);
                const F = permute(B, P);
                const L_next = R_prev;
                const R_next = xor(L_prev, F);

                traceLogs.push(
                    <div
                        key={`p2_r${i}`}
                        className="mb-6 ml-2 border-2 border-slate-300 bg-white rounded-lg shadow-md overflow-hidden text-base"
                    >
                        <div className="bg-slate-200 px-4 py-3 border-b-2 border-slate-300">
                            <p className="font-extrabold text-black uppercase tracking-wide">
                                🔄 Chi tiết vòng lặp thứ {i + 1}
                            </p>
                        </div>

                        <div className="p-5 space-y-5 text-black">
                            <div>
                                <p className="font-bold">
                                    5. Hàm mở rộng E(R
                                    <sub className="font-bold">{i}</sub>):
                                </p>
                                <p className="font-mono mt-2 bg-slate-100 p-2 border-2 border-slate-300 rounded break-all font-semibold text-slate-900">
                                    ER<sub className="font-bold">{i}</sub> ={" "}
                                    {E_R}
                                </p>
                            </div>

                            <div>
                                <p className="font-bold">
                                    6. Phép XOR ER
                                    <sub className="font-bold">{i}</sub> với K
                                    <sub className="font-bold">{i + 1}</sub>:
                                </p>
                                <p className="font-mono mt-2 bg-slate-100 p-2 border-2 border-slate-300 rounded break-all font-semibold text-slate-900">
                                    A = ER<sub className="font-bold">{i}</sub> ⊕
                                    K<sub className="font-bold">{i + 1}</sub> ={" "}
                                    <span className="text-purple-700 font-bold">
                                        {A}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <p className="font-bold mb-2">
                                    7. Thực hiện phép thế S-box đối với A:
                                </p>
                                <div className="overflow-x-auto rounded border-2 border-slate-300 shadow-sm">
                                    <table className="min-w-full text-center border-collapse font-mono text-sm">
                                        <thead className="bg-slate-300 text-black">
                                            <tr>
                                                <th className="p-2 border-r-2 border-slate-400 font-bold">
                                                    S-box
                                                </th>
                                                <th className="p-2 border-r-2 border-slate-400 font-bold">
                                                    Block (6 bit)
                                                </th>
                                                <th className="p-2 border-r-2 border-slate-400 font-bold">
                                                    Row
                                                </th>
                                                <th className="p-2 border-r-2 border-slate-400 font-bold">
                                                    Col
                                                </th>
                                                <th className="p-2 border-r-2 border-slate-400 font-bold">
                                                    Val (Hệ 10)
                                                </th>
                                                <th className="p-2 font-bold text-green-900">
                                                    Bin (4 bit)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-black font-semibold">
                                            {sboxDetails.map((d, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="border-t-2 border-slate-300 hover:bg-slate-100 even:bg-slate-50"
                                                >
                                                    <td className="p-2 border-r-2 border-slate-300 font-bold text-blue-900">
                                                        S{d.sbox}
                                                    </td>
                                                    <td className="p-2 border-r-2 border-slate-300">
                                                        {d.block}
                                                    </td>
                                                    <td className="p-2 border-r-2 border-slate-300">
                                                        {d.row}
                                                    </td>
                                                    <td className="p-2 border-r-2 border-slate-300">
                                                        {d.col}
                                                    </td>
                                                    <td className="p-2 border-r-2 border-slate-300">
                                                        {d.val}
                                                    </td>
                                                    <td className="p-2 font-bold text-green-700">
                                                        {d.binVal}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <p className="font-mono mt-3 bg-slate-100 p-2 border-2 border-slate-300 rounded break-all font-semibold text-black">
                                    B = S(A) ={" "}
                                    <span className="text-green-700 font-bold text-lg">
                                        {B}
                                    </span>
                                </p>
                            </div>

                            <div>
                                <p className="font-bold">
                                    8. Hoán vị P đối với B:
                                </p>
                                <p className="font-mono mt-2 bg-slate-100 p-2 border-2 border-slate-300 rounded break-all font-semibold text-slate-900">
                                    F = P(B) = {F}
                                </p>
                            </div>

                            <div>
                                <p className="font-bold">
                                    9. Kết quả Vòng {i + 1}:
                                </p>
                                <div className="font-mono mt-2 bg-amber-100 p-4 border-2 border-amber-400 rounded-lg space-y-2 text-black shadow-sm font-semibold">
                                    <p>
                                        L
                                        <sub className="font-bold">{i + 1}</sub>{" "}
                                        = R<sub className="font-bold">{i}</sub>{" "}
                                        ={" "}
                                        <span className="text-red-700 font-bold break-all">
                                            {L_next}
                                        </span>
                                    </p>
                                    <p>
                                        R
                                        <sub className="font-bold">{i + 1}</sub>{" "}
                                        = L<sub className="font-bold">{i}</sub>{" "}
                                        ⊕ F ={" "}
                                        <span className="text-red-700 font-bold break-all">
                                            {R_next}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>,
                );

                summaryTableData.push({
                    round: i + 1,
                    L: L_next,
                    R: R_next,
                    K: keys[i],
                });

                L_prev = L_next;
                R_prev = R_next;
            }

            // BẢNG TỔNG HỢP 16 VÒNG
            traceLogs.push(
                <div key="p2_b10" className="mb-8 mt-8">
                    <p className="font-bold text-black mb-3 text-lg border-l-4 border-black pl-3">
                        10. Bảng Tổng Hợp 16 Vòng
                    </p>
                    <div className="overflow-x-auto rounded-lg border-2 border-slate-400 shadow-md">
                        <table className="min-w-full text-center text-sm font-mono border-collapse">
                            <thead className="bg-slate-800 text-white">
                                <tr>
                                    <th className="border-b-2 border-r-2 border-slate-600 p-3 font-bold text-base">
                                        Vòng i
                                    </th>
                                    <th className="border-b-2 border-r-2 border-slate-600 p-3 font-bold text-base">
                                        L_i (32 bit)
                                    </th>
                                    <th className="border-b-2 border-slate-600 p-3 font-bold text-base">
                                        R_i (32 bit)
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-black font-semibold">
                                {summaryTableData.map((row) => (
                                    <tr
                                        key={row.round}
                                        className="hover:bg-slate-200 even:bg-slate-100 bg-white"
                                    >
                                        <td className="border-b-2 border-r-2 border-slate-300 p-2 font-bold text-blue-900 text-base">
                                            {row.round}
                                        </td>
                                        <td className="border-b-2 border-r-2 border-slate-300 p-2 break-all">
                                            {row.L}
                                        </td>
                                        <td className="border-b-2 border-slate-300 p-2 break-all">
                                            {row.R}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>,
            );

            // B11: IP^-1
            const R16L16 = R_prev + L_prev;
            const finalBin = permute(R16L16, IP_INV);
            const cipherHex = binToHex(finalBin);

            traceLogs.push(
                <div key="p2_b11" className="mb-4 text-base">
                    <p className="font-bold text-black">
                        11. Hoán vị cuối cùng IP⁻¹ (Lưu ý: đảo R₁₆L₁₆ trước khi
                        hoán vị):
                    </p>
                    <div className="ml-4 font-mono bg-green-50 p-5 rounded-lg mt-3 border-2 border-green-400 shadow-md">
                        <p className="text-black mb-3 font-semibold">
                            R₁₆L₁₆ ={" "}
                            <span className="font-bold text-slate-900 break-all">
                                {R16L16}
                            </span>
                        </p>
                        <p className="text-black mb-5 pb-5 border-b-2 border-green-300 font-semibold">
                            C_bin = IP⁻¹(R₁₆L₁₆) ={" "}
                            <span className="font-bold text-slate-900 break-all">
                                {finalBin}
                            </span>
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <span className="text-black font-black text-xl uppercase">
                                Kết quả C (Hex) =
                            </span>
                            <span className="bg-white px-4 py-2 rounded-lg border-4 border-green-600 text-green-800 font-black text-2xl tracking-widest shadow-md">
                                {cipherHex}
                            </span>
                        </div>
                    </div>
                </div>,
            );

            setLogs(traceLogs);
            setFinalCipher(cipherHex);
        } catch (error: any) {
            alert("Lỗi: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans text-black">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* TIÊU ĐỀ & INPUT */}
                <div className="bg-white shadow-xl border border-gray-200 rounded-2xl w-full max-w-2xl mx-auto p-6 sm:p-8 space-y-6">
                    {/* Title */}
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Mã Hóa DES 🔐
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Trình giả lập thuật toán chuẩn 64-bit
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleCalculate} className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">
                                Khóa K (Hex - 16 ký tự)
                            </label>
                            <input
                                required
                                type="text"
                                maxLength={16}
                                value={keyHex}
                                onChange={(e) =>
                                    setKeyHex(
                                        e.target.value
                                            .toUpperCase()
                                            .replace(/[^0-9A-F]/g, ""),
                                    )
                                }
                                className="border text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono tracking-wider uppercase"
                                placeholder="VD: E35CB18E63EEED18"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">
                                Bản Rõ M (Hex - 16 ký tự)
                            </label>
                            <input
                                required
                                type="text"
                                maxLength={16}
                                value={msgHex}
                                onChange={(e) =>
                                    setMsgHex(
                                        e.target.value
                                            .toUpperCase()
                                            .replace(/[^0-9A-F]/g, ""),
                                    )
                                }
                                className="border text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono tracking-wider uppercase"
                                placeholder="VD: B71127D233E316C3"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 mt-2 rounded-lg font-semibold text-white transition bg-blue-500 hover:bg-blue-600 shadow-sm"
                        >
                            Bắt đầu Mã hóa
                        </button>
                    </form>

                    {/* Kết quả */}
                    {finalCipher && (
                        <div className="pt-4 border-t border-gray-200">
                            <span className="font-semibold text-gray-700 text-sm">
                                Kết quả Mã hóa (C):
                            </span>
                            <div className="mt-2 p-4 rounded-lg text-center font-mono text-xl sm:text-2xl font-bold tracking-widest bg-blue-100 text-blue-700 shadow-inner">
                                {finalCipher}
                            </div>
                        </div>
                    )}
                </div>

                {/* BẢNG TRA CỨU */}
                <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-300 overflow-hidden">
                    <button
                        onClick={() => setShowTables(!showTables)}
                        className="w-full p-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition rounded-t-2xl border-b border-slate-200"
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                            <span className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wider">
                                📚 Bảng Tra Cứu S-Box & Shift Left
                            </span>
                        </div>
                        <svg
                            className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${showTables ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {showTables && (
                        <div className="p-6 sm:p-8 space-y-10 border-t-2 border-slate-300">
                            <div>
                                <h4 className="font-black text-black text-lg mb-4 border-l-8 border-black pl-3 uppercase">
                                    1. Bảng Dịch Trái (ShiftLeft)
                                </h4>
                                <div className="overflow-x-auto rounded-lg border-2 border-slate-400 shadow-sm">
                                    <table className="min-w-full text-center border-collapse font-mono text-sm sm:text-base">
                                        <thead className="bg-slate-300">
                                            <tr>
                                                <th className="border-b-2 border-r-2 border-slate-400 p-3 font-bold text-black">
                                                    Vòng i
                                                </th>
                                                {Array.from(
                                                    { length: 16 },
                                                    (_, i) => (
                                                        <th
                                                            key={i}
                                                            className="border-b-2 border-slate-400 p-3 font-bold text-black"
                                                        >
                                                            {i + 1}
                                                        </th>
                                                    ),
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="bg-white">
                                                <td className="border-r-2 border-slate-400 p-3 font-bold text-black bg-slate-200">
                                                    Số bit dịch
                                                </td>
                                                {SHIFT_LEFT.map((v, i) => (
                                                    <td
                                                        key={i}
                                                        className="p-3 font-black text-blue-700 text-lg border-b border-slate-200"
                                                    >
                                                        {v}
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-black text-black text-lg mb-4 border-l-8 border-black pl-3 uppercase">
                                    2. Các bảng S-Box (S1 ➔ S8)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {S_BOXES.map((box, idx) => (
                                        <div
                                            key={idx}
                                            className="border-2 border-slate-400 rounded-lg p-4 bg-slate-100 font-mono text-sm overflow-x-auto shadow-sm"
                                        >
                                            <p className="font-black text-center mb-3 text-black bg-slate-300 py-2 rounded border-2 border-slate-400 text-base">
                                                S{idx + 1}
                                            </p>
                                            <table className="w-full text-center border-collapse bg-white border-2 border-slate-400">
                                                <tbody className="text-black font-bold">
                                                    {box.map((row, rIdx) => (
                                                        <tr
                                                            key={rIdx}
                                                            className="hover:bg-slate-200 even:bg-slate-100"
                                                        >
                                                            {row.map(
                                                                (val, cIdx) => (
                                                                    <td
                                                                        key={
                                                                            cIdx
                                                                        }
                                                                        className="p-2 border border-slate-300"
                                                                    >
                                                                        {val}
                                                                    </td>
                                                                ),
                                                            )}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* QUY TRÌNH CHI TIẾT */}
                {logs.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10 border-2 border-slate-300">
                        <h2 className="text-lg sm:text-xl font-bold text-slate-800 mb-6 pb-3 border-b-2 border-slate-200 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-slate-800 rounded-full"></span>
                            Quy trình giải chi tiết
                        </h2>
                        <div className="space-y-6">{logs}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
