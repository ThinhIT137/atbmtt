"use client";

import { useLoading } from "@/context/LoadingContext";
import React, { useEffect, useState } from "react";

// Khai báo kiểu dữ liệu cho lịch sử từng bước thay thế
type StepLog = {
    originalChar: string;
    resultChar: string;
    isLetter: boolean;
};

const Monoalphabetic = () => {
    const { setLoading } = useLoading();
    const [MaHoa, setMaHoa] = useState(true);

    const [M, setM] = useState<string>("");
    const [K, setK] = useState<string>(""); // Từ khóa (Keyword)
    const [C, setC] = useState<string>("");

    const [Mgiaima, setMgiaima] = useState<string>("");
    const [Kgiaima, setKgiaima] = useState<string>("");
    const [Cgiaima, setCgiaima] = useState<string>("");

    // State lưu chi tiết các bước và Bảng chữ cái đã xáo trộn
    const [stepLogs, setStepLogs] = useState<StepLog[]>([]);
    const [shuffledAlphabet, setShuffledAlphabet] = useState<string>("");

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
    }, [setLoading]);

    // HÀM TẠO BẢNG CHỮ CÁI XÁO TRỘN TỪ TỪ KHÓA
    const generateKeyAlphabet = (keyword: string) => {
        const cleanKey = keyword.toUpperCase().replace(/[^A-Z]/g, "");
        let newAlphabet = "";

        // 1. Thêm các chữ cái của Keyword vào trước (không lấy trùng lặp)
        for (let char of cleanKey) {
            if (!newAlphabet.includes(char)) {
                newAlphabet += char;
            }
        }
        // 2. Thêm các chữ cái còn lại của bảng A-Z
        for (let char of alphabet) {
            if (!newAlphabet.includes(char)) {
                newAlphabet += char;
            }
        }
        return newAlphabet;
    };

    // HÀM MÃ HÓA
    const mahoa = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!M || !K) {
            alert("Bạn đang để trống M hoặc Keyword (K)");
            setLoading(false);
            return;
        }

        const currentShuffled = generateKeyAlphabet(K);
        setShuffledAlphabet(currentShuffled);

        let result = "";
        let logs: StepLog[] = [];
        const textToProcess = M.toUpperCase();

        for (let i = 0; i < textToProcess.length; i++) {
            const char = textToProcess[i];
            const index = alphabet.indexOf(char);

            if (index === -1) {
                // Không phải chữ cái -> giữ nguyên
                result += char;
                logs.push({
                    originalChar: char,
                    resultChar: char,
                    isLetter: false,
                });
            } else {
                // Lấy chữ cái tương ứng ở bảng xáo trộn
                const newChar = currentShuffled[index];
                result += newChar;
                logs.push({
                    originalChar: char,
                    resultChar: newChar,
                    isLetter: true,
                });
            }
        }

        setC(result);
        setStepLogs(logs);
        setLoading(false);
    };

    // HÀM GIẢI MÃ
    const giaima = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!Cgiaima || !Kgiaima) {
            alert("Bạn đang để trống C hoặc Keyword (K)");
            setLoading(false);
            return;
        }

        const currentShuffled = generateKeyAlphabet(Kgiaima);
        setShuffledAlphabet(currentShuffled);

        let result = "";
        let logs: StepLog[] = [];
        const textToProcess = Cgiaima.toUpperCase();

        for (let i = 0; i < textToProcess.length; i++) {
            const char = textToProcess[i];
            const index = currentShuffled.indexOf(char);

            if (index === -1) {
                // Không phải chữ cái -> giữ nguyên
                result += char;
                logs.push({
                    originalChar: char,
                    resultChar: char,
                    isLetter: false,
                });
            } else {
                // Giải mã thì lấy ngược lại từ bảng xáo trộn tra về bảng A-Z gốc
                const newChar = alphabet[index];
                result += newChar;
                logs.push({
                    originalChar: char,
                    resultChar: newChar,
                    isLetter: true,
                });
            }
        }

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
                        Monoalphabetic Cipher 🔐
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Mã hóa thay thế đơn chữ (Ánh xạ 1-1)
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
                                    setC("");
                                } else {
                                    setCgiaima(e.target.value);
                                    setMgiaima("");
                                }
                            }}
                            className="border text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="VD: HELLO"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Nhập Từ khóa (Keyword)
                        </label>
                        <input
                            key={MaHoa ? "encryptKey" : "decryptKey"}
                            type="text"
                            value={MaHoa ? K : Kgiaima}
                            onChange={(e) => {
                                if (MaHoa) {
                                    setK(e.target.value);
                                    setC("");
                                } else {
                                    setKgiaima(e.target.value);
                                    setMgiaima("");
                                }
                            }}
                            className="border text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="VD: SECURITY"
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

                        {/* Bước 1: Bảng đối chiếu Alphabet */}
                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                1. Bảng đối chiếu Alphabet 1-1 (Xáo trộn theo
                                khóa):
                            </span>
                            <div className="mt-2 w-full overflow-x-auto pb-2">
                                <div className="flex gap-1 min-w-max">
                                    {alphabet.split("").map((char, i) => (
                                        <div
                                            key={i}
                                            className="flex flex-col w-8 sm:w-10 text-center font-mono"
                                        >
                                            {/* Hàng bảng chữ cái Gốc */}
                                            <div className="bg-gray-300 text-gray-800 font-bold py-1 rounded-t-md text-sm sm:text-base">
                                                {char}
                                            </div>
                                            {/* Hàng bảng chữ cái Mã hóa */}
                                            <div className="bg-indigo-100 text-indigo-700 font-bold py-1 rounded-b-md text-sm sm:text-base border-t border-white">
                                                {shuffledAlphabet[i]}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500 mt-2 italic">
                                *Các chữ cái của Keyword sẽ được xếp lên đầu,
                                sau đó là các chữ cái còn lại của bảng A-Z.
                            </div>
                        </div>

                        {/* Bước 2: Chi tiết quá trình thay thế */}
                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                2. Quá trình ánh xạ thay thế từng ký tự:
                            </span>
                            <div className="mt-2 space-y-2 max-h-[250px] overflow-y-auto pr-2">
                                {stepLogs.map((log, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-white border p-3 rounded-lg shadow-sm text-sm"
                                    >
                                        {/* Ký tự nhập vào */}
                                        <div className="font-mono font-bold text-lg text-gray-800 w-12 text-center">
                                            {log.originalChar === " "
                                                ? "␣"
                                                : log.originalChar}
                                        </div>

                                        {/* Phép chiếu */}
                                        <div className="flex-1 text-center text-gray-500 font-medium px-2">
                                            {log.isLetter ? (
                                                <>➔ Biến đổi thành ➔</>
                                            ) : (
                                                <span>Giữ nguyên</span>
                                            )}
                                        </div>

                                        {/* Ký tự kết quả */}
                                        <div className="font-mono font-bold text-lg w-12 text-center text-indigo-600">
                                            {log.resultChar === " "
                                                ? "␣"
                                                : log.resultChar}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bước 3: Kết quả cuối cùng */}
                        <div className="pt-4 border-t">
                            <span className="font-semibold text-gray-700">
                                3. Kết quả{" "}
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

export default Monoalphabetic;
