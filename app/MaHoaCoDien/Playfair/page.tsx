"use client";

import { useLoading } from "@/context/LoadingContext";
import { useEffect, useState, FormEvent } from "react";

// Khai báo kiểu dữ liệu cho lịch sử từng bước dịch chuyển
type StepLog = {
    originalPair: string;
    rule: string;
    resultPair: string;
};

const Playfair = () => {
    const { setLoading } = useLoading();
    const [MaHoa, setMaHoa] = useState(true);

    // States cho Mã hóa
    const [M, setM] = useState<string>("");
    const [K, setK] = useState<string>("");
    const [C, setC] = useState<string>("");

    // States cho Giải mã
    const [CGiaiMa, setCGiaiMa] = useState<string>("");
    const [KGiaiMa, setKGiaiMa] = useState<string>("");
    const [MGiaiMa, setMGiaiMa] = useState<string>("");

    // States hiển thị chi tiết các bước
    const [matrix, setMatrix] = useState<string[][]>([]);
    const [pairs, setPairs] = useState<string[]>([]);
    const [stepLogs, setStepLogs] = useState<StepLog[]>([]); // State mới để lưu chi tiết dịch chuyển

    const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; // Bỏ J, gộp I/J

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
    }, [setLoading]);

    // HÀM TẠO MA TRẬN
    const getMatrix = (_k_e_y_: string) => {
        const mtrix = Array.from({ length: 5 }, () => Array(5).fill(""));
        const key = _k_e_y_.toUpperCase().replace(/J/g, "I");
        let fullKey = "";

        [...key].forEach((char) => {
            if (alphabet.includes(char) && !fullKey.includes(char)) {
                fullKey += char;
            }
        });
        [...alphabet].forEach((char) => {
            if (!fullKey.includes(char)) {
                fullKey += char;
            }
        });

        let index = 0;
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                mtrix[i][j] = fullKey[index++];
            }
        }
        return mtrix;
    };

    const findPos = (mtrix: string[][], char: string) => {
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 5; j++) {
                if (mtrix[i][j] === char) {
                    return { row: i, col: j };
                }
            }
        }
        return null;
    };

    // Chuẩn bị văn bản
    const prepareText = (text: string) => {
        text = text
            .toUpperCase()
            .replace(/J/g, "I")
            .replace(/[^A-Z]/g, "");

        let result: string[] = [];
        for (let i = 0; i < text.length; i++) {
            let a = text[i];
            let b = text[i + 1];
            if (a === b) {
                result.push(a + "X");
            } else {
                if (b) {
                    result.push(a + b);
                    i++;
                } else {
                    result.push(a + "X");
                }
            }
        }
        return result;
    };

    // HÀM MÃ HÓA
    const mahoa = (e: FormEvent) => {
        e.preventDefault();
        if (!M || !K) {
            alert("Vui lòng nhập đầy đủ Bản rõ (M) và Khóa (K)");
            return;
        }

        const mtrix = getMatrix(K);
        const pairList = prepareText(M);
        let result = "";
        let logs: StepLog[] = [];

        pairList.forEach((p) => {
            const posA = findPos(mtrix, p[0]);
            const posB = findPos(mtrix, p[1]);

            if (!posA || !posB) return;

            let char1 = "";
            let char2 = "";
            let ruleName = "";

            if (posA.row === posB.row) {
                // Cùng hàng: Dịch phải
                ruleName = "Cùng hàng (Dịch phải)";
                char1 = mtrix[posA.row][(posA.col + 1) % 5];
                char2 = mtrix[posB.row][(posB.col + 1) % 5];
            } else if (posA.col === posB.col) {
                // Cùng cột: Dịch xuống
                ruleName = "Cùng cột (Dịch xuống)";
                char1 = mtrix[(posA.row + 1) % 5][posA.col];
                char2 = mtrix[(posB.row + 1) % 5][posB.col];
            } else {
                // Khác hàng, khác cột: Hình chữ nhật
                ruleName = "Hình chữ nhật (Đổi góc)";
                char1 = mtrix[posA.row][posB.col];
                char2 = mtrix[posB.row][posA.col];
            }

            result += char1 + char2;
            logs.push({
                originalPair: p,
                rule: ruleName,
                resultPair: char1 + char2,
            });
        });

        setMatrix(mtrix);
        setPairs(pairList);
        setStepLogs(logs); // Cập nhật log ra UI
        setC(result);
    };

    const giaima = (e: FormEvent) => {
        e.preventDefault();
        if (!CGiaiMa || !KGiaiMa) {
            alert("Vui lòng nhập đầy đủ Bản mã (C) và Khóa (K)");
            return;
        }

        const mtrix = getMatrix(KGiaiMa);
        let cleanC = CGiaiMa.toUpperCase()
            .replace(/J/g, "I")
            .replace(/[^A-Z]/g, "");
        let pairList: string[] = [];
        for (let i = 0; i < cleanC.length; i += 2) {
            pairList.push(cleanC[i] + (cleanC[i + 1] || "X"));
        }

        let result = "";
        let logs: StepLog[] = [];

        pairList.forEach((p) => {
            const posA = findPos(mtrix, p[0]);
            const posB = findPos(mtrix, p[1]);

            if (!posA || !posB) return;

            let char1 = "";
            let char2 = "";
            let ruleName = "";

            if (posA.row === posB.row) {
                // Cùng hàng: Dịch trái
                ruleName = "Cùng hàng (Dịch trái)";
                char1 = mtrix[posA.row][(posA.col - 1 + 5) % 5];
                char2 = mtrix[posB.row][(posB.col - 1 + 5) % 5];
            } else if (posA.col === posB.col) {
                // Cùng cột: Dịch lên
                ruleName = "Cùng cột (Dịch lên)";
                char1 = mtrix[(posA.row - 1 + 5) % 5][posA.col];
                char2 = mtrix[(posB.row - 1 + 5) % 5][posB.col];
            } else {
                // Khác hàng, khác cột: Hình chữ nhật
                ruleName = "Hình chữ nhật (Đổi góc)";
                char1 = mtrix[posA.row][posB.col];
                char2 = mtrix[posB.row][posA.col];
            }

            result += char1 + char2;
            logs.push({
                originalPair: p,
                rule: ruleName,
                resultPair: char1 + char2,
            });
        });

        setMatrix(mtrix);
        setPairs(pairList);
        setStepLogs(logs); 
        setMGiaiMa(result);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 py-8">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6">
                {/* Title */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Playfair Cipher 🔐
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Ma trận 5x5 (I/J gộp chung)
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => {
                            setMaHoa(true);
                            setMatrix([]);
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
                            setMatrix([]);
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
                            placeholder={MaHoa ? "VD: HELLO" : "VD: EC MZZ"}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-semibold text-gray-700">
                            Nhập Khóa (K)
                        </label>
                        <input
                            key={MaHoa ? "encryptKey" : "decryptKey"}
                            type="text"
                            value={MaHoa ? K : KGiaiMa}
                            onChange={(e) => {
                                if (MaHoa) {
                                    setK(e.target.value);
                                    setC("");
                                } else {
                                    setKGiaiMa(e.target.value);
                                    setMGiaiMa("");
                                }
                            }}
                            className="border text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="VD: MONARCHY"
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
                {matrix.length > 0 && (
                    <div className="bg-gray-50 border rounded-xl p-5 space-y-6 mt-4">
                        <h3 className="text-center font-bold text-gray-800 border-b pb-2">
                            CHI TIẾT CÁC BƯỚC
                        </h3>

                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                1. Ma trận khóa 5x5:
                            </span>
                            <div className="grid grid-cols-5 gap-1 w-max mx-auto mt-2 bg-white p-2 border rounded shadow-sm">
                                {matrix.map((row, i) =>
                                    row.map((cell, j) => (
                                        <div
                                            key={`${i}-${j}`}
                                            className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border bg-gray-50 font-bold text-gray-800"
                                        >
                                            {cell}
                                        </div>
                                    )),
                                )}
                            </div>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                2.{" "}
                                {MaHoa
                                    ? "Bản rõ chia cặp (Thêm X nếu cần)"
                                    : "Bản mã chia cặp"}
                                :
                            </span>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {pairs.map((pair, idx) => (
                                    <span
                                        key={idx}
                                        className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded font-mono font-bold text-sm"
                                    >
                                        {pair}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                3. Chi tiết dịch chuyển:
                            </span>
                            <div className="mt-2 space-y-2">
                                {stepLogs.map((log, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between bg-white border p-3 rounded-lg shadow-sm text-sm"
                                    >
                                        <div className="font-mono font-bold text-lg text-gray-800 w-12 text-center">
                                            {log.originalPair}
                                        </div>
                                        <div className="flex-1 text-center text-gray-500 font-medium px-2">
                                            {" "}
                                            ➔ {log.rule} ➔{" "}
                                        </div>
                                        <div className="font-mono font-bold text-lg w-12 text-center text-indigo-600">
                                            {log.resultPair}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-4 border-t">
                            <span className="font-semibold text-gray-700">
                                4. Kết quả{" "}
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

export default Playfair;
