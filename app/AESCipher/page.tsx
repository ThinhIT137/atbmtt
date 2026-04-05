"use client";

import React, { useState } from "react";

// ==========================================
// HẰNG SỐ & BẢNG CHUẨN CỦA AES-128
// ==========================================
const SBOX = [
    0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b,
    0xfe, 0xd7, 0xab, 0x76, 0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0,
    0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0, 0xb7, 0xfd, 0x93, 0x26,
    0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
    0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2,
    0xeb, 0x27, 0xb2, 0x75, 0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0,
    0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84, 0x53, 0xd1, 0x00, 0xed,
    0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
    0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f,
    0x50, 0x3c, 0x9f, 0xa8, 0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5,
    0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2, 0xcd, 0x0c, 0x13, 0xec,
    0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
    0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14,
    0xde, 0x5e, 0x0b, 0xdb, 0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c,
    0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79, 0xe7, 0xc8, 0x37, 0x6d,
    0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
    0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f,
    0x4b, 0xbd, 0x8b, 0x8a, 0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e,
    0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e, 0xe1, 0xf8, 0x98, 0x11,
    0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
    0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f,
    0xb0, 0x54, 0xbb, 0x16,
];

const RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

// ==========================================
// HÀM HỖ TRỢ XỬ LÝ BYTE / MA TRẬN
// ==========================================
const toHex = (n: number) =>
    (n ?? 0).toString(16).padStart(2, "0").toUpperCase();
const wordToHex = (w: number[]) => w.map(toHex).join("");
const stateToHex = (s: number[][]) =>
    s.map((col) => col.map(toHex).join("")).join("");

const hexToMatrix = (hex: string): number[][] => {
    const bytes = hex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || [];
    return [
        [bytes[0], bytes[1], bytes[2], bytes[3]],
        [bytes[4], bytes[5], bytes[6], bytes[7]],
        [bytes[8], bytes[9], bytes[10], bytes[11]],
        [bytes[12], bytes[13], bytes[14], bytes[15]],
    ];
};

const rotWord = (w: number[]) => [w[1], w[2], w[3], w[0]];
const subWord = (w: number[]) => w.map((b) => SBOX[b] ?? 0);
const xorWord = (w1: number[], w2: number[]) => w1.map((b, i) => b ^ w2[i]);

const subBytes = (s: number[][]) =>
    s.map((col) => col.map((b) => SBOX[b] ?? 0));

const shiftRows = (s: number[][]) => [
    [s[0][0], s[1][1], s[2][2], s[3][3]],
    [s[1][0], s[2][1], s[3][2], s[0][3]],
    [s[2][0], s[3][1], s[0][2], s[1][3]],
    [s[3][0], s[0][1], s[1][2], s[2][3]],
];

const gf_mul_2 = (v: number) => ((v << 1) & 0xff) ^ (v & 0x80 ? 0x1b : 0);
const gf_mul_3 = (v: number) => gf_mul_2(v) ^ v;

const mixColumns = (s: number[][]) => {
    const res = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    for (let c = 0; c < 4; c++) {
        res[c][0] = gf_mul_2(s[c][0]) ^ gf_mul_3(s[c][1]) ^ s[c][2] ^ s[c][3];
        res[c][1] = s[c][0] ^ gf_mul_2(s[c][1]) ^ gf_mul_3(s[c][2]) ^ s[c][3];
        res[c][2] = s[c][0] ^ s[c][1] ^ gf_mul_2(s[c][2]) ^ gf_mul_3(s[c][3]);
        res[c][3] = gf_mul_3(s[c][0]) ^ s[c][1] ^ s[c][2] ^ gf_mul_2(s[c][3]);
    }
    return res;
};

const addRoundKey = (s: number[][], keyMatrix: number[][]) => {
    return s.map((col, cIdx) =>
        col.map((b, rIdx) => b ^ keyMatrix[cIdx][rIdx]),
    );
};

// UI Component hiển thị Ma trận 4x4
const StateMatrix = ({
    state,
    title,
}: {
    state: number[][];
    title?: string;
}) => (
    <div className="inline-block bg-white border border-slate-300 rounded shadow-sm p-1.5 mx-1 align-middle">
        {title && (
            <div className="text-xs font-bold text-center text-slate-500 mb-1 border-b pb-0.5">
                {title}
            </div>
        )}
        <div className="grid grid-cols-4 gap-1 text-center font-mono text-[13px] sm:text-sm font-semibold">
            {[0, 1, 2, 3].map((r) =>
                [0, 1, 2, 3].map((c) => (
                    <div
                        key={`${r}-${c}`}
                        className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-slate-100 rounded text-slate-800"
                    >
                        {toHex(state[c][r])}
                    </div>
                )),
            )}
        </div>
    </div>
);

// UI Component hiển thị 1 cột (Word)
const WordBlock = ({
    word,
    title,
    color = "bg-slate-100 text-slate-800",
}: {
    word: number[];
    title?: string;
    color?: string;
}) => (
    <div className="inline-block bg-white border border-slate-300 rounded shadow-sm p-1.5 mx-1 align-middle">
        {title && (
            <div className="text-[11px] sm:text-xs font-bold text-center text-slate-500 mb-1 border-b pb-0.5">
                {title}
            </div>
        )}
        <div className="flex flex-col gap-1 text-center font-mono text-[13px] sm:text-sm font-semibold">
            {word.map((b, i) => (
                <div
                    key={i}
                    className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded ${color}`}
                >
                    {toHex(b)}
                </div>
            ))}
        </div>
    </div>
);

// Component Công Thức (Hiển thị đẹp mắt)
const FormulaLabel = ({ text }: { text: string }) => (
    <div className="mb-2">
        <span className="inline-block text-indigo-700 bg-indigo-50 px-2.5 py-1.5 rounded-md text-[13px] sm:text-sm font-mono font-semibold border border-indigo-200">
            📌 Công thức: <span className="font-bold">{text}</span>
        </span>
    </div>
);

// ==========================================
// COMPONENT CHÍNH
// ==========================================
export default function AESCipher() {
    const [keyHex, setKeyHex] = useState("344E74129CD8D1D127FC62A01EF147B7");
    const [msgHex, setMsgHex] = useState("58A89BB7073DAA060FF436751C46674C");

    const [logsP1, setLogsP1] = useState<React.ReactNode[]>([]);
    const [logsP2, setLogsP2] = useState<React.ReactNode[]>([]);
    const [finalCipher, setFinalCipher] = useState("");
    const [showTables, setShowTables] = useState(false);

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (keyHex.length !== 32 || msgHex.length !== 32) {
                throw new Error(
                    "Key và Message phải dài đúng 32 ký tự Hex (128 bits).",
                );
            }

            let traceP1: React.ReactNode[] = [];
            let traceP2: React.ReactNode[] = [];

            const K_matrix = hexToMatrix(keyHex);
            const M_matrix = hexToMatrix(msgHex);

            // ==========================================
            // PHẦN 1: SINH 10 KHÓA (KEY EXPANSION)
            // ==========================================
            let w: number[][] = [...K_matrix];

            traceP1.push(
                <div key="p1_init" className="mb-6 text-sm sm:text-base">
                    <p className="font-bold text-slate-800 mb-3">
                        1. Chia khóa K (128 bit) thành 4 word (mỗi word 1 cột)
                    </p>
                    <div className="ml-0 sm:ml-4 flex flex-wrap items-center gap-2 sm:gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <FormulaLabel text="K ➔ w₀, w₁, w₂, w₃ (mỗi khối 32-bit)" />
                        <div className="flex flex-wrap items-center w-full gap-3 mt-2">
                            <StateMatrix state={K_matrix} title="Khóa K" />
                            <span className="font-bold text-slate-400">➔</span>
                            <div className="flex gap-2">
                                <WordBlock word={w[0]} title="w₀" />
                                <WordBlock word={w[1]} title="w₁" />
                                <WordBlock word={w[2]} title="w₂" />
                                <WordBlock word={w[3]} title="w₃" />
                            </div>
                        </div>
                    </div>
                </div>,
            );

            let allKeysData = [];

            for (let i = 4; i < 44; i++) {
                let temp = [...w[i - 1]];

                if (i === 4) {
                    const rw = rotWord(temp);
                    traceP1.push(
                        <div
                            key="p1_step2"
                            className="mb-6 text-sm sm:text-base"
                        >
                            <p className="font-bold text-slate-800 mb-3">
                                2. Dịch vòng trái 1 byte đối với w₃
                            </p>
                            <div className="ml-0 sm:ml-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <FormulaLabel text="RotWord([b₀, b₁, b₂, b₃]) = [b₁, b₂, b₃, b₀]" />
                                <div className="flex flex-wrap items-center gap-3">
                                    <WordBlock word={temp} title="w₃" />
                                    <span className="font-bold text-slate-400">
                                        ➔
                                    </span>
                                    <WordBlock
                                        word={rw}
                                        title="RotWord(w₃)"
                                        color="bg-purple-100 text-purple-800"
                                    />
                                </div>
                            </div>
                        </div>,
                    );

                    const sw = subWord(rw);
                    traceP1.push(
                        <div
                            key="p1_step3"
                            className="mb-6 text-sm sm:text-base"
                        >
                            <p className="font-bold text-slate-800 mb-3">
                                3. Thay thế từng byte trong rw bằng S-box
                            </p>
                            <div className="ml-0 sm:ml-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <FormulaLabel text="SubWord([b₀, b₁, b₂, b₃]) = [SBOX(b₀), SBOX(b₁), SBOX(b₂), SBOX(b₃)]" />
                                <div className="flex flex-wrap items-center gap-3">
                                    <WordBlock word={rw} title="rw" />
                                    <span className="font-bold text-slate-400">
                                        ➔
                                    </span>
                                    <WordBlock
                                        word={sw}
                                        title="SubWord(rw)"
                                        color="bg-purple-100 text-purple-800"
                                    />
                                </div>
                            </div>
                        </div>,
                    );

                    const xcsw = [...sw];
                    xcsw[0] ^= RCON[i / 4];
                    traceP1.push(
                        <div
                            key="p1_step4"
                            className="mb-6 text-sm sm:text-base"
                        >
                            <p className="font-bold text-slate-800 mb-3">
                                4. sw XOR với Rcon[1]
                            </p>
                            <div className="ml-0 sm:ml-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <FormulaLabel text="XorRcon([b₀, b₁, b₂, b₃], Rcon) = [b₀ ⊕ Rcon, b₁, b₂, b₃]" />
                                <div className="flex flex-wrap items-center gap-3">
                                    <WordBlock word={sw} title="sw" />
                                    <span className="font-bold text-slate-400">
                                        ⊕
                                    </span>
                                    <WordBlock
                                        word={[RCON[i / 4], 0, 0, 0]}
                                        title="Rcon[1]"
                                    />
                                    <span className="font-bold text-slate-400">
                                        ➔
                                    </span>
                                    <WordBlock
                                        word={xcsw}
                                        title="xcsw"
                                        color="bg-purple-100 text-purple-800"
                                    />
                                </div>
                            </div>
                        </div>,
                    );

                    temp = xcsw;
                } else if (i % 4 === 0) {
                    temp = rotWord(temp);
                    temp = subWord(temp);
                    temp[0] ^= RCON[i / 4];
                }

                const newWord = xorWord(w[i - 4], temp);
                w.push(newWord);

                // In ma trận tính khóa K1
                if (i === 7) {
                    traceP1.push(
                        <div
                            key="p1_step5"
                            className="mb-8 text-sm sm:text-base"
                        >
                            <p className="font-bold text-slate-800 mb-3">
                                5. Tính khóa K1 = (w₄, w₅, w₆, w₇)
                            </p>
                            <div className="ml-0 sm:ml-4 flex flex-col gap-5 bg-blue-50/50 p-4 sm:p-6 rounded-xl border border-blue-200 shadow-sm">
                                <FormulaLabel text="wᵢ = wᵢ₋₄ ⊕ wᵢ₋₁ (hoặc ⊕ temp nếu vòng chia hết cho 4)" />
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <span className="font-bold text-slate-700 w-8 text-right">
                                        w₄ =
                                    </span>
                                    <WordBlock word={w[i - 4]} title="xcsw" />{" "}
                                    <span className="text-slate-400">⊕</span>{" "}
                                    <WordBlock word={w[0]} title="w₀" />{" "}
                                    <span className="text-slate-400">➔</span>{" "}
                                    <WordBlock
                                        word={w[4]}
                                        title="w₄"
                                        color="bg-blue-100 text-blue-800"
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <span className="font-bold text-slate-700 w-8 text-right">
                                        w₅ =
                                    </span>
                                    <WordBlock word={w[4]} title="w₄" />{" "}
                                    <span className="text-slate-400">⊕</span>{" "}
                                    <WordBlock word={w[1]} title="w₁" />{" "}
                                    <span className="text-slate-400">➔</span>{" "}
                                    <WordBlock
                                        word={w[5]}
                                        title="w₅"
                                        color="bg-blue-100 text-blue-800"
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <span className="font-bold text-slate-700 w-8 text-right">
                                        w₆ =
                                    </span>
                                    <WordBlock word={w[5]} title="w₅" />{" "}
                                    <span className="text-slate-400">⊕</span>{" "}
                                    <WordBlock word={w[2]} title="w₂" />{" "}
                                    <span className="text-slate-400">➔</span>{" "}
                                    <WordBlock
                                        word={w[6]}
                                        title="w₆"
                                        color="bg-blue-100 text-blue-800"
                                    />
                                </div>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                    <span className="font-bold text-slate-700 w-8 text-right">
                                        w₇ =
                                    </span>
                                    <WordBlock word={w[6]} title="w₆" />{" "}
                                    <span className="text-slate-400">⊕</span>{" "}
                                    <WordBlock word={w[3]} title="w₃" />{" "}
                                    <span className="text-slate-400">➔</span>{" "}
                                    <WordBlock
                                        word={w[7]}
                                        title="w₇"
                                        color="bg-blue-100 text-blue-800"
                                    />
                                </div>

                                <div className="pt-4 border-t border-blue-200 flex flex-wrap items-center gap-4">
                                    <span className="font-extrabold text-blue-900 uppercase">
                                        ➔ Ghép lại thành Khóa K1:
                                    </span>
                                    <StateMatrix
                                        state={[w[4], w[5], w[6], w[7]]}
                                        title="K₁"
                                    />
                                </div>
                            </div>
                        </div>,
                    );
                }

                // Lưu lại các khóa để in bảng
                if (i % 4 === 3) {
                    allKeysData.push({
                        round: i / 4,
                        k: `${wordToHex(w[i - 3])}${wordToHex(w[i - 2])}${wordToHex(w[i - 1])}${wordToHex(w[i])}`,
                    });
                }
            }

            traceP1.push(
                <div key="p1_summary" className="mt-8">
                    <p className="font-bold text-slate-800 mb-3 border-l-4 border-slate-400 pl-2">
                        Bảng Tổng Hợp 10 Khóa (K1 - K10): Lặp lại từ Bài 2 đến
                        Bài 5
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-slate-300 shadow-sm">
                        <table className="min-w-full text-center text-sm font-mono">
                            <thead className="bg-slate-100 text-slate-700 border-b border-slate-300">
                                <tr>
                                    <th className="p-3 border-r border-slate-300">
                                        Vòng i
                                    </th>
                                    <th className="p-3">
                                        Khóa Ki (Hex - 128 bit)
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {allKeysData.map((data, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b border-slate-200 hover:bg-slate-50"
                                    >
                                        <td className="p-3 border-r border-slate-300 font-bold text-slate-600">
                                            K{data.round}
                                        </td>
                                        <td className="p-3 font-semibold text-blue-700 tracking-wider break-all">
                                            {data.k}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>,
            );

            // ==========================================
            // PHẦN 2: MÃ HÓA
            // ==========================================
            let state = [...M_matrix];

            traceP2.push(
                <div key="p2_step6" className="mb-6 text-sm sm:text-base">
                    <p className="font-bold text-slate-800 mb-2">
                        6. Tính kết quả AddRoundKey(M, K₀)
                    </p>
                    <div className="ml-0 sm:ml-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                        <FormulaLabel text="State = M ⊕ K₀" />
                        <div className="flex flex-wrap items-center gap-2 sm:gap-6 mt-2">
                            <StateMatrix state={state} title="M" />
                            <span className="font-bold text-slate-400">⊕</span>
                            <StateMatrix state={K_matrix} title="K₀" />
                            <span className="font-bold text-slate-400">➔</span>
                            {(() => {
                                state = addRoundKey(state, w.slice(0, 4));
                                return (
                                    <StateMatrix state={state} title="State" />
                                );
                            })()}
                        </div>
                    </div>
                </div>,
            );

            // Loop 9 rounds
            for (let round = 1; round <= 9; round++) {
                traceP2.push(
                    <div
                        key={`p2_r${round}`}
                        className="mb-6 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm"
                    >
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                            <p className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-800 w-6 h-6 rounded flex justify-center items-center">
                                    {round}
                                </span>
                                VÒNG LẶP THỨ {round}
                            </p>
                        </div>
                        <div className="p-4 sm:p-5 space-y-6 text-sm sm:text-base">
                            <div>
                                <p className="font-semibold text-slate-700 mb-3 border-l-2 border-slate-300 pl-2">
                                    7. SubByte (Thay thế S-box)
                                </p>
                                <FormulaLabel text="State'₍r,c₎ = SBOX[ State₍r,c₎ ]" />
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <StateMatrix
                                        state={state}
                                        title="Input State"
                                    />{" "}
                                    <span className="text-slate-400">➔</span>
                                    {(() => {
                                        state = subBytes(state);
                                        return (
                                            <StateMatrix
                                                state={state}
                                                title="Output State"
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-700 mb-3 border-l-2 border-slate-300 pl-2">
                                    8. ShiftRows (Dịch vòng trái)
                                </p>
                                <FormulaLabel text="Hàng r dịch vòng trái r byte (r = 0, 1, 2, 3)" />
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <StateMatrix
                                        state={state}
                                        title="Input State"
                                    />{" "}
                                    <span className="text-slate-400">➔</span>
                                    {(() => {
                                        state = shiftRows(state);
                                        return (
                                            <StateMatrix
                                                state={state}
                                                title="Output State"
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-700 mb-3 border-l-2 border-slate-300 pl-2">
                                    9. MixColumns (Trộn cột)
                                </p>
                                <FormulaLabel text="State' = Ma trận MixColumn × State (Trong GF(2⁸))" />
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <StateMatrix
                                        state={state}
                                        title="Input State"
                                    />{" "}
                                    <span className="text-slate-400">➔</span>
                                    {(() => {
                                        state = mixColumns(state);
                                        return (
                                            <StateMatrix
                                                state={state}
                                                title="Output State"
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-slate-700 mb-3 border-l-2 border-slate-300 pl-2">
                                    10. AddRoundKey (XOR với K{round})
                                </p>
                                <FormulaLabel
                                    text={`State' = State ⊕ K${round}`}
                                />
                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                    <StateMatrix
                                        state={state}
                                        title="Input State"
                                    />{" "}
                                    <span className="text-slate-400">⊕</span>
                                    <StateMatrix
                                        state={w.slice(
                                            round * 4,
                                            round * 4 + 4,
                                        )}
                                        title={`K${round}`}
                                    />{" "}
                                    <span className="text-slate-400">➔</span>
                                    {(() => {
                                        state = addRoundKey(
                                            state,
                                            w.slice(round * 4, round * 4 + 4),
                                        );
                                        return (
                                            <StateMatrix
                                                state={state}
                                                title="Output State"
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>,
                );
            }

            // Vòng 10 (Round 10)
            traceP2.push(
                <div
                    key={`p2_r10`}
                    className="mb-6 border border-red-200 rounded-lg overflow-hidden bg-white shadow-md"
                >
                    <div className="bg-red-50 px-4 py-3 border-b border-red-200">
                        <p className="font-extrabold text-red-800 text-sm uppercase tracking-wider flex items-center gap-2">
                            <span className="bg-red-200 text-red-900 w-6 h-6 rounded flex justify-center items-center">
                                10
                            </span>
                            11. VÒNG LẶP CUỐI (VÒNG 10) - Bỏ qua MixColumns
                        </p>
                    </div>
                    <div className="p-4 sm:p-5 space-y-6 text-sm sm:text-base">
                        <div>
                            <p className="font-semibold text-slate-700 mb-3 border-l-2 border-slate-300 pl-2">
                                SubByte (Thay thế S-box)
                            </p>
                            <FormulaLabel text="State'₍r,c₎ = SBOX[ State₍r,c₎ ]" />
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <StateMatrix state={state} title="Input" />{" "}
                                <span className="text-slate-400">➔</span>
                                {(() => {
                                    state = subBytes(state);
                                    return (
                                        <StateMatrix
                                            state={state}
                                            title="Output"
                                        />
                                    );
                                })()}
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-700 mb-3 border-l-2 border-slate-300 pl-2">
                                ShiftRows (Dịch vòng trái)
                            </p>
                            <FormulaLabel text="Hàng r dịch vòng trái r byte (r = 0, 1, 2, 3)" />
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                                <StateMatrix state={state} title="Input" />{" "}
                                <span className="text-slate-400">➔</span>
                                {(() => {
                                    state = shiftRows(state);
                                    return (
                                        <StateMatrix
                                            state={state}
                                            title="Output"
                                        />
                                    );
                                })()}
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-700 mb-3 border-l-2 border-slate-300 pl-2">
                                AddRoundKey (XOR với K10) ➔ TẠO RA BẢN MÃ C
                            </p>
                            <FormulaLabel text="C = State ⊕ K10" />
                            <div className="flex flex-wrap items-center gap-3 mt-2 bg-red-50/30 p-4 rounded-lg border border-red-100">
                                <StateMatrix state={state} title="Input" />{" "}
                                <span className="text-slate-400">⊕</span>
                                <StateMatrix
                                    state={w.slice(40, 44)}
                                    title="K10"
                                />{" "}
                                <span className="font-bold text-red-400">
                                    ➔
                                </span>
                                {(() => {
                                    state = addRoundKey(state, w.slice(40, 44));
                                    return (
                                        <StateMatrix
                                            state={state}
                                            title="BẢN MÃ C"
                                        />
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>,
            );

            const cipherHex = stateToHex(state);

            setLogsP1(traceP1);
            setLogsP2(traceP2);
            setFinalCipher(cipherHex);
        } catch (error: any) {
            alert("Lỗi: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 font-sans text-slate-900">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* TIÊU ĐỀ & INPUT */}
                <div className="bg-white shadow-xl border border-gray-200 rounded-2xl w-full max-w-2xl mx-auto p-6 sm:p-8 space-y-6">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Mã Hóa AES-128 🛡️
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Trình giả lập thuật toán chuẩn 128-bit
                        </p>
                    </div>

                    <form onSubmit={handleCalculate} className="space-y-4">
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">
                                Khóa K (Hex - 32 ký tự)
                            </label>
                            <input
                                required
                                type="text"
                                maxLength={32}
                                value={keyHex}
                                onChange={(e) =>
                                    setKeyHex(
                                        e.target.value
                                            .toUpperCase()
                                            .replace(/[^0-9A-F]/g, ""),
                                    )
                                }
                                className="border text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono tracking-wider uppercase text-sm"
                                placeholder="VD: 344E74129CD8D1D127FC62A01EF147B7"
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-semibold text-gray-700">
                                Bản Rõ M (Hex - 32 ký tự)
                            </label>
                            <input
                                required
                                type="text"
                                maxLength={32}
                                value={msgHex}
                                onChange={(e) =>
                                    setMsgHex(
                                        e.target.value
                                            .toUpperCase()
                                            .replace(/[^0-9A-F]/g, ""),
                                    )
                                }
                                className="border text-slate-800 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono tracking-wider uppercase text-sm"
                                placeholder="VD: 58A89BB7073DAA060FF436751C46674C"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2.5 mt-2 rounded-lg font-semibold text-white transition bg-blue-600 hover:bg-blue-700 shadow-sm"
                        >
                            Bắt đầu Mã hóa
                        </button>
                    </form>

                    {finalCipher && (
                        <div className="pt-4 border-t border-gray-200">
                            <span className="font-semibold text-gray-700 text-sm">
                                Kết quả Mã hóa (C):
                            </span>
                            <div className="mt-2 p-4 rounded-lg text-center font-mono text-lg sm:text-xl font-bold tracking-widest bg-blue-50 border border-blue-200 text-blue-700 shadow-inner break-all">
                                {finalCipher}
                            </div>
                        </div>
                    )}
                </div>

                {/* BẢNG TRA CỨU */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    <button
                        onClick={() => setShowTables(!showTables)}
                        className="w-full p-4 flex justify-between items-center bg-slate-50 hover:bg-slate-100 transition rounded-t-2xl border-b border-slate-200"
                    >
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-5 bg-blue-600 rounded-full"></span>
                            <span className="text-sm sm:text-base font-bold text-slate-800 uppercase tracking-wider">
                                Bảng Tra Cứu S-Box & MixColumns
                            </span>
                        </div>
                        <svg
                            className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${showTables ? "rotate-180" : ""}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2.5}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {showTables && (
                        <div className="p-6 sm:p-8 space-y-10">
                            {/* Bảng S-BOX */}
                            <div>
                                <h4 className="font-bold text-slate-800 text-base sm:text-lg mb-4 border-l-4 border-blue-600 pl-3 uppercase">
                                    Bảng thế S-Box cho AES
                                </h4>
                                <div className="overflow-x-auto rounded border border-slate-300 shadow-sm">
                                    <table className="min-w-full text-center border-collapse font-mono text-xs sm:text-sm">
                                        <thead className="bg-blue-50 text-blue-900 border-b border-slate-300">
                                            <tr>
                                                <th className="p-1.5 sm:p-2 border-r border-slate-300 font-bold"></th>
                                                {[...Array(16)].map((_, i) => (
                                                    <th
                                                        key={i}
                                                        className="p-1.5 sm:p-2 border-r border-slate-200 font-bold"
                                                    >
                                                        {i
                                                            .toString(16)
                                                            .toUpperCase()}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="text-slate-700 bg-white">
                                            {[...Array(16)].map((_, row) => (
                                                <tr
                                                    key={row}
                                                    className="border-b border-slate-200 hover:bg-slate-50"
                                                >
                                                    <td className="p-1.5 sm:p-2 border-r border-slate-300 font-bold bg-blue-50 text-blue-900">
                                                        {row
                                                            .toString(16)
                                                            .toUpperCase()}
                                                    </td>
                                                    {[...Array(16)].map(
                                                        (_, col) => (
                                                            <td
                                                                key={col}
                                                                className="p-1.5 sm:p-2 border-r border-slate-200 font-semibold"
                                                            >
                                                                {toHex(
                                                                    SBOX[
                                                                        row *
                                                                            16 +
                                                                            col
                                                                    ],
                                                                )}
                                                            </td>
                                                        ),
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* MixColumn Matrix */}
                            <div>
                                <h4 className="font-bold text-slate-800 text-base sm:text-lg mb-4 border-l-4 border-blue-600 pl-3 uppercase">
                                    Ma trận nhân MixColumn
                                </h4>
                                <div className="inline-block bg-slate-50 p-4 rounded-lg border border-slate-300 font-mono text-sm sm:text-base font-bold text-slate-800 shadow-sm text-center">
                                    <p>[02 03 01 01]</p>
                                    <p>[01 02 03 01]</p>
                                    <p>[01 01 02 03]</p>
                                    <p>[03 01 01 02]</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* QUY TRÌNH CHI TIẾT */}
                {(logsP1.length > 0 || logsP2.length > 0) && (
                    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-slate-200 space-y-10">
                        {/* HEADER */}
                        <h2 className="text-lg sm:text-xl font-bold text-slate-800 pb-3 border-b-2 border-slate-200 uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-slate-800 rounded-full"></span>
                            Quy trình giải chi tiết AES
                        </h2>

                        {/* PHẦN 1 */}
                        <div>
                            <h3 className="text-lg font-bold text-blue-800 mb-4 bg-blue-50 py-2 px-3 rounded border-l-4 border-blue-600 uppercase">
                                PHẦN 1: SINH 10 KHÓA Ki TỪ KHÓA K
                            </h3>
                            <div className="space-y-4 pl-0 sm:pl-2">
                                {logsP1}
                            </div>
                        </div>

                        <hr className="border-slate-200" />

                        {/* PHẦN 2 */}
                        <div>
                            <h3 className="text-lg font-bold text-red-800 mb-4 bg-red-50 py-2 px-3 rounded border-l-4 border-red-600 uppercase">
                                PHẦN 2: MÃ HÓA
                            </h3>
                            <div className="space-y-4 pl-0 sm:pl-2">
                                {logsP2}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
