"use client";

import { useLoading } from "@/context/LoadingContext";
import React, { useEffect, useState } from "react";

type StepLog = {
    originalChar: string;
    shift: number;
    resultChar: string;
    isLetter: boolean;
};

const Caesar = () => {
    const { setLoading } = useLoading();

    const [MaHoa, setMaHoa] = useState(true);

    const [M, setM] = useState<string>("");
    const [K, setK] = useState<number>(0);
    const [C, setC] = useState<string>("");

    const [MGiaiMa, setMGiaiMa] = useState<string>("");
    const [KGiaiMa, setKGiaiMa] = useState<number>(0);
    const [CGiaiMa, setCGiaiMa] = useState<string>("");

    const [stepLogs, setStepLogs] = useState<StepLog[]>([]);
    const [appliedShift, setAppliedShift] = useState<number>(0);

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    useEffect(() => {
        setLoading(true);

        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);

        return () => clearTimeout(timer);
    }, [setLoading]);

    const mahoa = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!M) {
            alert("Bạn đang để trống M");
            setLoading(false);
            return;
        }

        let result = "";
        let logs: StepLog[] = [];
        const textToProcess = M.toUpperCase();

        for (let i = 0; i < textToProcess.length; i++) {
            const char = textToProcess[i];
            const index = alphabet.indexOf(char);

            if (index === -1) {
                result += char;
                logs.push({
                    originalChar: char,
                    shift: 0,
                    resultChar: char,
                    isLetter: false,
                });
            } else {
                const shift = ((K % 26) + 26) % 26;
                const newIndex = (index + shift) % 26;
                const newChar = alphabet[newIndex];

                result += newChar;
                logs.push({
                    originalChar: char,
                    shift: K,
                    resultChar: newChar,
                    isLetter: true,
                });
            }
        }

        setC(result);
        setStepLogs(logs);
        setAppliedShift(K);
        setLoading(false);
    };

    const giaima = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!CGiaiMa) {
            alert("Bạn đang để trống C");
            setLoading(false);
            return;
        }

        let result = "";
        let logs: StepLog[] = [];
        const textToProcess = CGiaiMa.toUpperCase();

        for (let i = 0; i < textToProcess.length; i++) {
            const char = textToProcess[i];
            const index = alphabet.indexOf(char);

            if (index === -1) {
                result += char;
                logs.push({
                    originalChar: char,
                    shift: 0,
                    resultChar: char,
                    isLetter: false,
                });
            } else {
                const shift = ((KGiaiMa % 26) + 26) % 26;
                const newIndex = (index - shift + 26) % 26;
                const newChar = alphabet[newIndex];

                result += newChar;
                logs.push({
                    originalChar: char,
                    shift: -KGiaiMa,
                    resultChar: newChar,
                    isLetter: true,
                });
            }
        }

        setMGiaiMa(result);
        setStepLogs(logs);
        setAppliedShift(-KGiaiMa);
        setLoading(false);
    };

    const effectiveShift = ((appliedShift % 26) + 26) % 26;
    const shiftedAlphabet =
        alphabet.slice(effectiveShift) + alphabet.slice(0, effectiveShift);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 py-8">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6">
                {/* Title */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Caesar Cipher 🔐
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Dịch chuyển vòng tròn bảng chữ cái
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
                            value={MaHoa ? M : CGiaiMa}
                            onChange={(e) => {
                                if (MaHoa) {
                                    setM(e.target.value);
                                    setC("");
                                } else {
                                    setCGiaiMa(e.target.value);
                                    setMGiaiMa("");
                                }
                            }}
                            className="border text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="VD: HELLO"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Nhập Khóa K (Số bước dịch)
                        </label>
                        <input
                            key={MaHoa ? "encryptKey" : "decryptKey"}
                            type="number"
                            value={MaHoa ? K : KGiaiMa}
                            onChange={(e) => {
                                if (MaHoa) {
                                    setK(Number(e.target.value));
                                    setC("");
                                } else {
                                    setKGiaiMa(Number(e.target.value));
                                    setMGiaiMa("");
                                }
                            }}
                            className="border text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="VD: 3"
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
                                1. Bảng đối chiếu alphabet (Dịch{" "}
                                {appliedShift > 0
                                    ? `+${appliedShift}`
                                    : appliedShift}
                                ):
                            </span>
                            <div className="mt-2 w-full overflow-x-auto pb-2">
                                <div className="flex gap-1 min-w-max">
                                    {alphabet.split("").map((char, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col w-8 sm:w-10 text-center font-mono"
                                        >
                                            {/* Hàng gốc */}
                                            <div className="bg-gray-300 text-gray-800 font-bold py-1 rounded-t-md text-sm sm:text-base">
                                                {char}
                                            </div>
                                            {/* Hàng đã dịch */}
                                            <div className="bg-indigo-100 text-indigo-700 font-bold py-1 rounded-b-md text-sm sm:text-base border-t border-white">
                                                {shiftedAlphabet[i]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                2. Quá trình dịch chuyển từng ký tự:
                            </span>
                            <div className="mt-2 space-y-2">
                                {stepLogs.map((log, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-white border p-3 rounded-lg shadow-sm text-sm"
                                    >
                                        <div className="font-mono font-bold text-lg text-gray-800 w-12 text-center">
                                            {log.originalChar === " "
                                                ? "␣"
                                                : log.originalChar}
                                        </div>
                                        <div className="flex-1 text-center text-gray-500 font-medium px-2">
                                            {log.isLetter ? (
                                                <>
                                                    ➔ Dịch{" "}
                                                    <span
                                                        className={
                                                            log.shift >= 0
                                                                ? "text-blue-500"
                                                                : "text-red-500"
                                                        }
                                                    >
                                                        {log.shift > 0
                                                            ? `+${log.shift}`
                                                            : log.shift}
                                                    </span>{" "}
                                                    ➔
                                                </>
                                            ) : (
                                                <span>Giữ nguyên</span>
                                            )}
                                        </div>
                                        <div className="font-mono font-bold text-lg w-12 text-center text-indigo-600">
                                            {log.resultChar === " "
                                                ? "␣"
                                                : log.resultChar}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <span className="font-semibold text-gray-700">
                                3. Kết quả{" "}
                                {MaHoa ? "Mã hóa (C)" : "Giải mã (M)"}:
                            </span>
                            <div
                                className={`mt-2 p-4 rounded-lg text-center font-mono text-2xl font-bold tracking-widest ${
                                    MaHoa
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-green-100 text-green-700"
                                }`}
                            >
                                {MaHoa ? C : MGiaiMa}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Caesar;
