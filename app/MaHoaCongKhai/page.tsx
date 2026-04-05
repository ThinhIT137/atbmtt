"use client";

import { DiffieHellman, RSA, EIGamal, DSA } from "@/components/router";
import { useLoading } from "@/context/LoadingContext";
import { useNextRouter } from "@/hooks/useNextRouter";
import { useEffect } from "react";

const algorithms = [
    {
        name: "Thuật toán RSA",
        desc: "Hệ mật mã khóa công khai (Mã hóa & Giải mã)",
        path: RSA,
        color: "blue",
    },
    {
        name: "Trao đổi khóa Diffie-Hellman",
        desc: "Thuật toán trao đổi khóa phiên an toàn",
        path: DiffieHellman,
        color: "green",
    },
    {
        name: "Mật mã ElGamal",
        desc: "Hệ mật mã dựa trên logarit rời rạc",
        path: EIGamal,
        color: "purple",
    },
    {
        name: "Chữ ký điện tử DSA",
        desc: "Thuật toán chữ ký điện tử chuẩn NIST",
        path: DSA,
        color: "yellow",
    },
];

const colorClasses: Record<string, string> = {
    blue: "hover:bg-blue-50 hover:border-blue-400 group-hover:text-blue-600",
    green: "hover:bg-green-50 hover:border-green-400 group-hover:text-green-600",
    purple: "hover:bg-purple-50 hover:border-purple-400 group-hover:text-purple-600",
    yellow: "hover:bg-yellow-50 hover:border-yellow-400 group-hover:text-yellow-600",
};

const MaHoaCongKhaiPage = () => {
    const { setLoading } = useLoading();
    const { go } = useNextRouter();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 200);
        return () => clearTimeout(timer);
    }, [setLoading]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
                <div className="text-center">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Mã Hóa Công Khai 🔑
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Hệ mật mã phi đối xứng (Asymmetric Cryptography)
                    </p>
                </div>

                <div className="grid gap-4">
                    {algorithms.map((algo, index) => (
                        <div
                            key={index}
                            onClick={() => go(algo.path)}
                            className={`p-4 rounded-xl border cursor-pointer transition group ${colorClasses[algo.color]}`}
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

export default MaHoaCongKhaiPage;
