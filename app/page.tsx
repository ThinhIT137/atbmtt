"use client";

import Loading from "@/components/loading";

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
            {" "}
            <div className="text-center space-y-6 px-6">
                {/* Title */}
                <h1 className="text-3xl sm:text-5xl font-bold tracking-wide">
                    🔐 Crypto Tool
                </h1>
                {/* Subtitle */}
                <p className="text-gray-300 text-sm sm:text-base">
                    Công cụ tính toán & mô phỏng các thuật toán mã hóa cổ điển,
                    mã hóa công khai, AES, DES
                </p>
                {/* Author */}
                <p className="text-gray-400 text-xs sm:text-sm italic">
                    Developed by{" "}
                    <span className="text-blue-400 font-semibold">
                        ThinhIT137
                    </span>
                </p>
                {/* Loading */}
                <div className="pt-4">
                    <Loading />
                </div>
            </div>
        </div>
    );
}
