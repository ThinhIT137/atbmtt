"use client";

import { useLoading } from "@/context/LoadingContext";
import React, { useEffect, useState } from "react";

// Khai báo kiểu dữ liệu cho lịch sử từng bước di chuyển
type StepLog = {
    originalChar: string;
    targetRow: number; // Chữ cái này sẽ nhảy vào hàng nào
    targetCol: number; // Và cột nào
};

const RailFence = () => {
    const { setLoading } = useLoading();
    const [MaHoa, setMaHoa] = useState(true);

    const [M, setM] = useState<string>("");
    const [K, setK] = useState<number>(2); // Key cho Rail Fence là Số lượng hàng
    const [C, setC] = useState<string>("");

    const [Mgiaima, setMgiaima] = useState<string>("");
    const [Kgiaima, setKgiaima] = useState<number>(2);
    const [Cgiaima, setCgiaima] = useState<string>("");

    // States hiển thị chi tiết lên UI
    const [stepLogs, setStepLogs] = useState<StepLog[]>([]);
    const [railGrid, setRailGrid] = useState<string[][]>([]); // Ma trận lưới Rail Fence
    const [rowResults, setRowResults] = useState<string[]>([]); // State mới: lưu chuỗi của từng hàng

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
    }, [setLoading]);

    // HÀM MÃ HÓA HOÁN VỊ RAIL FENCE (ZIG-ZAG)
    const mahoa = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!M) {
            alert("Bạn đang để trống M");
            setLoading(false);
            return;
        }
        if (K < 2) {
            alert("Số lượng hàng (K) phải lớn hơn hoặc bằng 2!");
            setLoading(false);
            return;
        }

        const text = M.toUpperCase().replace(/[^A-Z]/g, ""); // Lọc rặt chữ
        const numRows = K;
        const numCols = text.length;

        // Tạo ma trận lưới Rail Fence, initialized với khoảng trắng
        const grid: string[][] = Array.from({ length: numRows }, () =>
            Array(numCols).fill(""),
        );

        let row = 0;
        let direction = 1; // 1: xuống, -1: lên
        let logs: StepLog[] = [];

        // Bước 1: Điền chữ vào bảng theo đường Zig-zag
        for (let col = 0; col < numCols; col++) {
            grid[row][col] = text[col];
            logs.push({
                originalChar: text[col],
                targetRow: row,
                targetCol: col,
            });

            // Cập nhật hàng cho ký tự tiếp theo
            row += direction;

            // Nếu chạm đáy hoặc chạm đỉnh -> đổi chiều
            if (row === numRows - 1 || row === 0) {
                direction *= -1;
            }
        }

        // Bước 2: Đọc ra theo từng hàng ngang để lấy bản mã
        let result = "";
        let rowStrs: string[] = []; // Mảng lưu chuỗi của từng hàng

        for (let r = 0; r < numRows; r++) {
            let rowStr = "";
            for (let c = 0; c < numCols; c++) {
                if (grid[r][c] !== "") {
                    rowStr += grid[r][c];
                }
            }
            rowStrs.push(rowStr);
            result += rowStr;
        }

        setRailGrid(grid);
        setStepLogs(logs);
        setRowResults(rowStrs); // Lưu kết quả từng hàng
        setC(result);
        setLoading(false);
    };

    // HÀM GIẢI MÃ HOÁN VỊ RAIL FENCE
    const giaima = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!Cgiaima) {
            alert("Bạn đang để trống C");
            setLoading(false);
            return;
        }
        if (Kgiaima < 2) {
            alert("Số lượng hàng (K) phải lớn hơn hoặc bằng 2!");
            setLoading(false);
            return;
        }

        const text = Cgiaima.toUpperCase().replace(/[^A-Z]/g, "");
        const numRows = Kgiaima;
        const numCols = text.length;

        // Tạo ma trận để đánh dấu đường đi Zig-zag trước
        const markGrid: string[][] = Array.from({ length: numRows }, () =>
            Array(numCols).fill(""),
        );

        let row = 0;
        let direction = 1;

        // Đánh dấu '*' vào đường đi Zig-zag
        for (let col = 0; col < numCols; col++) {
            markGrid[row][col] = "*";
            row += direction;
            if (row === numRows - 1 || row === 0) {
                direction *= -1;
            }
        }

        // Bước 1: Điền bản mã vào các ô vuông đã đánh dấu '*' theo từng hàng
        let index = 0;
        const grid: string[][] = Array.from({ length: numRows }, () =>
            Array(numCols).fill(""),
        );
        let rowStrs: string[] = [];

        for (let r = 0; r < numRows; r++) {
            let rowStr = "";
            for (let c = 0; c < numCols; c++) {
                if (markGrid[r][c] === "*" && index < text.length) {
                    const char = text[index++];
                    grid[r][c] = char;
                    rowStr += char;
                }
            }
            rowStrs.push(rowStr);
        }

        // Bước 2: Đọc bảng theo đường Zig-zag để lấy bản rõ
        let result = "";
        row = 0;
        direction = 1;
        for (let col = 0; col < numCols; col++) {
            if (grid[row][col] !== "") {
                result += grid[row][col];
            }
            row += direction;
            if (row === numRows - 1 || row === 0) {
                direction *= -1;
            }
        }

        setRailGrid(grid);
        setRowResults(rowStrs); // Lưu kết quả từng hàng
        setMgiaima(result);
        setStepLogs([]);
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4 py-8">
            <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl p-6 sm:p-8 space-y-6">
                {/* Title */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Rail Fence Cipher 🔐
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Mã hóa hoán vị đường ray (Zig-zag)
                    </p>
                </div>

                {/* Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => {
                            setMaHoa(true);
                            setRailGrid([]);
                            setRowResults([]);
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
                            setRailGrid([]);
                            setRowResults([]);
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
                            Nhập Số lượng hàng (K)
                        </label>
                        <input
                            key={MaHoa ? "encryptKey" : "decryptKey"}
                            type="number"
                            min={2}
                            value={MaHoa ? K : Kgiaima}
                            onChange={(e) => {
                                if (MaHoa) {
                                    setK(parseInt(e.target.value));
                                    setC("");
                                } else {
                                    setKgiaima(parseInt(e.target.value));
                                    setMgiaima("");
                                }
                            }}
                            className="border text-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="VD: 2"
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
                {railGrid.length > 0 && (
                    <div className="bg-gray-50 border rounded-xl p-5 space-y-6 mt-4 overflow-hidden">
                        <h3 className="text-center font-bold text-gray-800 border-b pb-2">
                            CHI TIẾT CÁC BƯỚC
                        </h3>

                        {/* Bước 1: Phân tích đường đi Zig-zag (Chỉ hiện khi Mã Hóa) */}
                        {MaHoa && stepLogs.length > 0 && (
                            <div>
                                <span className="font-semibold text-gray-700 text-sm">
                                    1. Đường đi của từng ký tự trên lưới
                                    Zig-zag:
                                </span>
                                <div className="mt-2 space-y-2 max-h-[250px] overflow-y-auto pr-2">
                                    {stepLogs.map((log, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between bg-white border p-3 rounded-lg shadow-sm text-sm"
                                        >
                                            <div className="font-mono font-bold text-lg text-gray-800 w-12 text-center">
                                                {log.originalChar}
                                            </div>

                                            <div className="flex-1 text-center text-gray-500 font-medium px-2">
                                                ➔ Xếp vào Hàng{" "}
                                                <span className="font-bold text-indigo-600">
                                                    {log.targetRow + 1}
                                                </span>
                                                , Cột{" "}
                                                <span className="font-bold">
                                                    {log.targetCol + 1}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Bước 2: Bảng Ma Trận Lưới Rail Fence */}
                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                {MaHoa
                                    ? "2. Bảng Ma Trận Lưới Rail Fence (Điền theo Zig-zag, Đọc theo hàng)"
                                    : "1. Lấp Bản mã vào lưới (Điền theo hàng, Đọc theo Zig-zag)"}
                                :
                            </span>
                            <div className="mt-2 w-full overflow-x-auto pb-2">
                                <table className="mx-auto border-collapse bg-white shadow-sm rounded-lg border border-gray-300">
                                    <tbody>
                                        {railGrid.map((row, rIndex) => (
                                            <tr
                                                key={`row-${rIndex}`}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="bg-gray-200 border border-gray-300 p-2 sm:p-3 text-center font-bold text-gray-700">
                                                    Hàng {rIndex + 1}
                                                </td>
                                                {row.map((cell, cIndex) => (
                                                    <td
                                                        key={`cell-${rIndex}-${cIndex}`}
                                                        className="border border-gray-300 p-2 sm:p-3 text-center font-mono text-xl font-bold text-indigo-700 min-w-[3rem]"
                                                    >
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Bước 3: Đọc Kết quả từng hàng */}
                        <div>
                            <span className="font-semibold text-gray-700 text-sm">
                                {MaHoa ? "3." : "2."} Gom nhóm ký tự trên từng
                                hàng:
                            </span>
                            <div className="mt-2 space-y-2">
                                {rowResults.map((str, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 bg-white p-3 rounded-lg border shadow-sm"
                                    >
                                        <span className="font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-md text-sm">
                                            Hàng {idx + 1}
                                        </span>
                                        <span className="font-mono text-lg font-bold text-indigo-700 tracking-[0.2em]">
                                            {str}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bước 4: Kết quả cuối cùng */}
                        <div className="pt-4 border-t">
                            <span className="font-semibold text-gray-700">
                                {MaHoa
                                    ? "4. Kết quả Mã hóa (C) [Nối các hàng lại]"
                                    : "3. Kết quả Giải mã (M) [Đọc dọc theo Zig-zag]"}
                                :
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

export default RailFence;
