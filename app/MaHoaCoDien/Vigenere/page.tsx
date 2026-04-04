"use client";

import { useLoading } from "@/context/LoadingContext";
import React, { useEffect, useState } from "react";

type StepLog = {
    char: string;
    charIndex: number;
    keyChar: string;
    keyIndex: number;
    resultChar: string;
    resultIndex: number;
    isLetter: boolean; // Kiểm tra xem có phải chữ cái không
};

const Vigenere = () => {
    const { setLoading } = useLoading();
    const [MaHoa, setMaHoa] = useState(true);

    const [M, setM] = useState<string>("");
    const [K, setK] = useState<string>("");
    const [C, setC] = useState<string>("");
    const [Key, setKey] = useState<string>("");

    const [Mgiaima, setMgiaima] = useState<string>("");
    const [Kgiaima, setKgiaima] = useState<string>("");
    const [Cgiaima, setCgiaima] = useState<string>("");
    const [Keygiaima, setKeygiaima] = useState<string>("");

    // State lưu chi tiết các bước tính toán
    const [stepLogs, setStepLogs] = useState<StepLog[]>([]);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
    }, [setLoading]);

    const generateKey = (text: string, key: string) => {
        key = key.toUpperCase().replace(/[^A-Z]/g, ""); // Đảm bảo key chỉ chứa chữ
        text = text.toUpperCase();

        let result = "";
        let keyIndex = 0;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (alphabet.includes(char)) {
                result += key[keyIndex % key.length];
                keyIndex++;
            } else {
                result += char; // Bỏ qua ký tự đặc biệt, không tăng index của key
            }
        }
        return result;
    };

    const mahoa = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!M) {
            alert("Bạn đang để trống M");
            setLoading(false);
            return;
        }
        if (!K) {
            alert("Bạn đang để trống K");
            setLoading(false);
            return;
        }

        const text = M.toUpperCase();
        const keyLap = generateKey(text, K);
        let result = "";
        let logs: StepLog[] = [];

        for (let i = 0; i < text.length; i++) {
            const charM = text[i];
            const charKey = keyLap[i];
            const indexM = alphabet.indexOf(charM);

            if (indexM === -1) {
                // Ký tự đặc biệt hoặc dấu cách
                result += charM;
                logs.push({
                    char: charM,
                    charIndex: -1,
                    keyChar: charKey,
                    keyIndex: -1,
                    resultChar: charM,
                    resultIndex: -1,
                    isLetter: false,
                });
                continue;
            }

            const indexKey = alphabet.indexOf(charKey);
            const resultIndex = (indexM + indexKey) % 26;
            const finalChar = alphabet[resultIndex];

            result += finalChar;
            logs.push({
                char: charM,
                charIndex: indexM,
                keyChar: charKey,
                keyIndex: indexKey,
                resultChar: finalChar,
                resultIndex: resultIndex,
                isLetter: true,
            });
        }

        setKey(keyLap);
        setC(result);
        setStepLogs(logs);
        setLoading(false);
    };

    const giaima = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (!Cgiaima) {
            alert("Bạn đang để trống C");
            setLoading(false);
            return;
        }
        if (!Kgiaima) {
            alert("Bạn đang để trống K");
            setLoading(false);
            return;
        }

        const text = Cgiaima.toUpperCase();
        const keyLap = generateKey(text, Kgiaima);
        let result = "";
        let logs: StepLog[] = [];

        for (let i = 0; i < text.length; i++) {
            const charC = text[i];
            const charKey = keyLap[i];
            const indexC = alphabet.indexOf(charC);

            if (indexC === -1) {
                result += charC;
                logs.push({
                    char: charC,
                    charIndex: -1,
                    keyChar: charKey,
                    keyIndex: -1,
                    resultChar: charC,
                    resultIndex: -1,
                    isLetter: false,
                });
                continue;
            }

            const indexK = alphabet.indexOf(charKey);
            const resultIndex = (indexC - indexK + 26) % 26;
            const finalChar = alphabet[resultIndex];

            result += finalChar;
            logs.push({
                char: charC,
                charIndex: indexC,
                keyChar: charKey,
                keyIndex: indexK,
                resultChar: finalChar,
                resultIndex: resultIndex,
                isLetter: true,
            });
        }

        setKeygiaima(keyLap);
        setMgiaima(result);
        setStepLogs(logs);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 py-8">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6">
                {/* Title */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Vigenère Cipher 🔐
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Mã hóa đa bảng chữ cái (Cộng/Trừ Index)
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => {
                            setMaHoa(true);
                            setStepLogs([]);
                        }}
                        className={`w-1/2 py-2 rounded-md font-semibold transition ${
                            MaHoa
                                ? "bg-blue-500 text-white shadow"
                                : "text-gray-600"
                        }`}
                    >
                        Mã hóa
                    </button>
                    <button
                        onClick={() => {
                            setMaHoa(false);
                            setStepLogs([]);
                        }}
                        className={`w-1/2 py-2 rounded-md font-semibold transition ${
                            !MaHoa
                                ? "bg-green-500 text-white shadow"
                                : "text-gray-600"
                        }`}
                    >
                        Giải mã
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={MaHoa ? mahoa : giaima} className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">
                            {MaHoa ? "Nhập Bản rõ (M)" : "Nhập Bản mã (C)"}
                        </label>
                        <input
                            key={MaHoa ? "encrypt" : "decrypt"}
                            type="text"
                            value={MaHoa ? M : Cgiaima}
                            onChange={(e) => {
                                if (MaHoa) {
                                    setM(e.target.value);
                                    setKey("");
                                    setC("");
                                } else {
                                    setCgiaima(e.target.value);
                                    setKeygiaima("");
                                    setMgiaima("");
                                }
                            }}
                            className="border text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="VD: HELLO"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Nhập Khóa (K)
                        </label>
                        <input
                            key={MaHoa ? "encryptKey" : "decryptKey"}
                            type="text"
                            value={MaHoa ? K : Kgiaima}
                            onChange={(e) => {
                                if (MaHoa) {
                                    setK(e.target.value);
                                    setKey("");
                                    setC("");
                                } else {
                                    setKgiaima(e.target.value);
                                    setKeygiaima("");
                                    setMgiaima("");
                                }
                            }}
                            className="border text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="VD: KEY"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg font-semibold text-white transition ${
                            MaHoa
                                ? "bg-blue-500 hover:bg-blue-600"
                                : "bg-green-500 hover:bg-green-600"
                        }`}
                    >
                        {MaHoa ? "Bắt đầu Mã hóa" : "Bắt đầu Giải mã"}
                    </button>
                </form>

                {/* BẢNG KẾT QUẢ CHI TIẾT */}
                {stepLogs.length > 0 && (
                    <div className="bg-gray-50 border rounded-xl p-5 space-y-6 mt-4 overflow-hidden">
                        <h3 className="text-center font-bold text-gray-800 border-b pb-2">
                            CHI TIẾT CÁC BƯỚC
                        </h3>

                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                1. Bảng quy đổi Alphabet ra số (Index):
                            </span>
                            <div className="mt-2 w-full overflow-x-auto pb-2">
                                <div className="flex gap-1 min-w-max">
                                    {alphabet.split("").map((char, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col w-8 sm:w-10 text-center font-mono"
                                        >
                                            {/* Chữ cái */}
                                            <div className="bg-gray-800 text-white font-bold py-1 rounded-t-md text-sm sm:text-base">
                                                {char}
                                            </div>
                                            {/* Vị trí Index */}
                                            <div className="bg-gray-200 text-gray-600 font-semibold py-1 rounded-b-md text-xs sm:text-sm border-t border-white">
                                                {i}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                2. Khóa lặp (căn lề theo độ dài văn bản):
                            </span>
                            <div className="mt-2 p-3 bg-white border rounded-lg font-mono text-sm shadow-sm space-y-1">
                                <div className="flex flex-wrap gap-x-2">
                                    <span className="text-gray-500 w-12">
                                        Input:
                                    </span>
                                    <span className="tracking-widest font-bold text-gray-700">
                                        {(MaHoa ? M : Cgiaima).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex flex-wrap gap-x-2">
                                    <span className="text-purple-500 w-12 font-semibold">
                                        Key:
                                    </span>
                                    <span className="tracking-widest font-bold text-purple-600">
                                        {MaHoa ? Key : Keygiaima}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                3. Công thức áp dụng:
                            </span>
                            <div className="mt-2 p-3 bg-white border rounded-lg text-center shadow-sm text-indigo-800 text-sm font-semibold">
                                {MaHoa
                                    ? "Chỉ số C = (Chỉ số M + Chỉ số K) mod 26"
                                    : "Chỉ số M = (Chỉ số C - Chỉ số K + 26) mod 26"}
                            </div>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                4. Phép tính cho từng ký tự:
                            </span>
                            <div className="mt-2 space-y-2 max-h-[300px] overflow-y-auto pr-2">
                                {stepLogs.map((log, idx) => (
                                    <div key={idx}>
                                        {log.isLetter ? (
                                            <div className="flex items-center justify-between bg-white border p-3 rounded-lg shadow-sm text-sm">
                                                {/* Text char */}
                                                <div className="text-center flex-1">
                                                    <div className="font-bold text-lg text-gray-800">
                                                        {log.char}
                                                    </div>
                                                    <div className="text-xs font-semibold text-gray-500">
                                                        Idx: {log.charIndex}
                                                    </div>
                                                </div>

                                                <div className="font-bold text-gray-400">
                                                    {MaHoa ? "+" : "-"}
                                                </div>

                                                {/* Key char */}
                                                <div className="text-center flex-1">
                                                    <div className="font-bold text-lg text-purple-600">
                                                        {log.keyChar}
                                                    </div>
                                                    <div className="text-xs font-semibold text-purple-400">
                                                        Idx: {log.keyIndex}
                                                    </div>
                                                </div>

                                                <div className="font-bold text-gray-400">
                                                    ➔
                                                </div>

                                                {/* Result char */}
                                                <div className="text-center flex-1">
                                                    <div className="font-bold text-lg text-indigo-600">
                                                        {log.resultChar}
                                                    </div>
                                                    <div className="text-xs font-semibold text-indigo-400">
                                                        Idx: {log.resultIndex}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-center bg-gray-100 border p-3 rounded-lg shadow-sm text-sm text-gray-500">
                                                Ký tự "
                                                {log.char === " "
                                                    ? "Khoảng trắng"
                                                    : log.char}
                                                " ➔ Giữ nguyên
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <span className="font-semibold text-gray-700">
                                5. Kết quả{" "}
                                {MaHoa ? "Mã hóa (C)" : "Giải mã (M)"}:
                            </span>
                            <div
                                className={`mt-2 p-4 rounded-lg text-center font-mono text-2xl font-bold tracking-widest break-all ${
                                    MaHoa
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                                {MaHoa ? C : Mgiaima}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Vigenere;
