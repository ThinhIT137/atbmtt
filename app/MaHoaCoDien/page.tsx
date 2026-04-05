"use client";

import {
    Caesar,
    Vigenere,
    Vigenere_AutoKey,
    Monoalphabetic,
    Playfair,
    RailFence,
} from "@/components/router";
import { useLoading } from "@/context/LoadingContext";
import { useNextRouter } from "@/hooks/useNextRouter";
import { useEffect } from "react";

const algorithms = [
    {
        name: "Caesar Cipher",
        desc: "Dịch chuyển bảng chữ cái theo số K",
        path: Caesar,
        color: "blue",
    },
    {
        name: "Vigenère Cipher (Khóa Lặp)",
        desc: "Mã hóa đa bảng chữ cái với key lặp",
        path: Vigenere,
        color: "green",
    },
    {
        name: "Vigenère – AutoKey",
        desc: "Biến thể dùng key mở rộng theo plaintext",
        path: Vigenere_AutoKey,
        color: "purple",
    },
    {
        name: "Monoalphabetic Cipher (Mã Hóa Chữ Đơn)",
        desc: "Mã hóa thay thế đơn (Substitution Cipher)",
        path: Monoalphabetic,
        color: "yellow",
    },
    {
        name: "Playfair Cipher",
        desc: "Mã hóa theo cặp ký tự (ma trận 5x5)",
        path: Playfair,
        color: "red",
    },
    {
        name: "Rail Fence Cipher (Mật Mã Hoán Vị)",
        desc: "Mã hóa hoán vị dạng zigzag",
        path: RailFence,
        color: "indigo",
    },
];

const colorClasses: Record<string, string> = {
    blue: "hover:bg-blue-50 hover:border-blue-400 group-hover:text-blue-600",
    green: "hover:bg-green-50 hover:border-green-400 group-hover:text-green-600",
    purple: "hover:bg-purple-50 hover:border-purple-400 group-hover:text-purple-600",
    yellow: "hover:bg-yellow-50 hover:border-yellow-400 group-hover:text-yellow-600",
    red: "hover:bg-red-50 hover:border-red-400 group-hover:text-red-600",
    indigo: "hover:bg-indigo-50 hover:border-indigo-400 group-hover:text-indigo-600",
};

const MaHoaCoDien = () => {
    const { setLoading } = useLoading();
    const { go } = useNextRouter();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Mã Hóa Cổ Điển 🔐
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Chọn thuật toán bạn muốn sử dụng
                    </p>
                </div>

                <div className="grid gap-4">
                    {algorithms.map((algo, index) => (
                        <div
                            key={index}
                            onClick={() => go(algo.path)}
                            className={`p-4 rounded-xl border cursor-pointer transition group ${colorClasses[algo.color as keyof typeof colorClasses]}`}
                        >
                            <h2 className="font-semibold text-lg text-gray-800">
                                {algo.name}
                            </h2>
                            <p className="text-sm text-gray-500">{algo.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MaHoaCoDien;
