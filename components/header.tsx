"use client";

import Link from "next/link";
import React, { useState } from "react";
import {
    MaHoaCoDien,
    Caesar,
    Vigenere,
    Vigenere_AutoKey,
    Monoalphabetic,
    Playfair,
    RailFence,
    Modulo,
    DESCipher,
    AESCipher,
    MaHoaCongKhai,
    DiffieHellman,
    DSA,
    EIGamal,
    RSA,
} from "./router";

// --- DỮ LIỆU DROPDOWN MÃ HÓA CỔ ĐIỂN ---
const classicAlgorithms = [
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
        name: "Monoalphabetic Cipher",
        desc: "Mã hóa thay thế đơn",
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
        name: "Rail Fence Cipher",
        desc: "Mã hóa hoán vị dạng zigzag",
        path: RailFence,
        color: "indigo",
    },
];

// --- DỮ LIỆU DROPDOWN MÃ HÓA CÔNG KHAI ---
const publicAlgorithms = [
    {
        name: "Thuật toán RSA",
        desc: "Mã hóa & Giải mã",
        path: RSA,
        color: "blue",
    },
    {
        name: "Diffie-Hellman",
        desc: "Trao đổi khóa phiên",
        path: DiffieHellman,
        color: "green",
    },
    {
        name: "Mật mã ElGamal",
        desc: "Mã hóa Logarit rời rạc",
        path: EIGamal,
        color: "purple",
    },
    {
        name: "Chữ ký DSA",
        desc: "Thuật toán chữ ký điện tử",
        path: DSA,
        color: "yellow",
    },
];

const colorClasses: Record<string, string> = {
    blue: "hover:bg-blue-50 text-blue-600",
    green: "hover:bg-green-50 text-green-600",
    purple: "hover:bg-purple-50 text-purple-600",
    yellow: "hover:bg-yellow-50 text-yellow-600",
    red: "hover:bg-red-50 text-red-600",
    indigo: "hover:bg-indigo-50 text-indigo-600",
};

export default function Header() {
    // State cho Mobile Menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isClassicMenuOpen, setIsClassicMenuOpen] = useState(false);
    const [isPublicMenuOpen, setIsPublicMenuOpen] = useState(false);

    // Hàm tự động đóng menu khi click chuyển trang (trên mobile)
    const handleLinkClick = () => {
        setIsMobileMenuOpen(false);
        setIsClassicMenuOpen(false);
        setIsPublicMenuOpen(false);
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* LOGO TRÁI */}
                    <div className="flex-shrink-0">
                        <Link
                            href="/"
                            onClick={handleLinkClick}
                            className="text-2xl font-extrabold text-gray-800 tracking-tight"
                        >
                            Crypto<span className="text-blue-600">Hub</span>
                        </Link>
                    </div>

                    {/* MENU PHẢI - CHỈ HIỆN TRÊN DESKTOP (md:flex) */}
                    <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center">
                        {/* ITEM 1: MÃ HÓA CỔ ĐIỂN */}
                        <div className="relative group">
                            <Link
                                href={MaHoaCoDien}
                                className="flex items-center text-gray-700 hover:text-blue-600 font-semibold py-2 transition-colors duration-200"
                            >
                                Mã Hóa Cổ Điển
                                <svg
                                    className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </Link>
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 pt-2 w-[340px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 grid gap-1">
                                    {classicAlgorithms.map((algo, index) => (
                                        <Link
                                            key={index}
                                            href={algo.path}
                                            className={`block p-3 rounded-lg transition-colors duration-150 ${colorClasses[algo.color]}`}
                                        >
                                            <p className="font-bold text-sm">
                                                {algo.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {algo.desc}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ITEM 2: MÃ HÓA CÔNG KHAI */}
                        <div className="relative group">
                            <Link
                                href={MaHoaCongKhai}
                                className="flex items-center text-gray-700 hover:text-blue-600 font-semibold py-2 transition-colors duration-200"
                            >
                                Mã Hóa Công Khai
                                <svg
                                    className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:rotate-180"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </Link>
                            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-0 pt-2 w-[340px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-2 grid gap-1">
                                    {publicAlgorithms.map((algo, index) => (
                                        <Link
                                            key={index}
                                            href={algo.path}
                                            className={`block p-3 rounded-lg transition-colors duration-150 ${colorClasses[algo.color]}`}
                                        >
                                            <p className="font-bold text-sm">
                                                {algo.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {algo.desc}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* CÁC ITEM CÒN LẠI */}
                        <Link
                            href={Modulo}
                            className="text-gray-700 hover:text-blue-600 font-semibold py-2 transition-colors duration-200"
                        >
                            Modulo
                        </Link>
                        <Link
                            href={DESCipher}
                            className="text-gray-700 hover:text-blue-600 font-semibold py-2 transition-colors duration-200"
                        >
                            DES
                        </Link>
                        <Link
                            href={AESCipher}
                            className="text-gray-700 hover:text-blue-600 font-semibold py-2 transition-colors duration-200"
                        >
                            AES
                        </Link>
                    </nav>

                    {/* NÚT HAMBURGER - CHỈ HIỆN TRÊN MOBILE (md:hidden) */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="text-gray-700 hover:text-blue-600 focus:outline-none p-2"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMobileMenuOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* KHU VỰC MENU MOBILE */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen
                        ? "max-h-[800px] opacity-100 border-t border-gray-100 shadow-lg"
                        : "max-h-0 opacity-0"
                }`}
            >
                <div className="bg-white px-4 pt-2 pb-6 space-y-2">
                    {/* Accordion 1: Mã Hóa Cổ Điển */}
                    <div>
                        <button
                            onClick={() =>
                                setIsClassicMenuOpen(!isClassicMenuOpen)
                            }
                            className="flex items-center justify-between w-full text-left font-semibold text-gray-700 hover:text-blue-600 py-3 border-b border-gray-50"
                        >
                            Mã Hóa Cổ Điển
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${isClassicMenuOpen ? "rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isClassicMenuOpen ? "max-h-[400px] mt-2" : "max-h-0"}`}
                        >
                            <div className="pl-4 py-2 space-y-1 bg-gray-50 rounded-lg border border-gray-100">
                                <Link
                                    href={MaHoaCoDien}
                                    onClick={handleLinkClick}
                                    className="block text-sm font-bold text-blue-600 py-2 mb-1 border-b border-gray-200"
                                >
                                    ➔ Trang tổng hợp Cổ Điển
                                </Link>
                                {classicAlgorithms.map((algo, index) => (
                                    <Link
                                        key={index}
                                        href={algo.path}
                                        onClick={handleLinkClick}
                                        className={`block py-2.5 px-2 text-sm rounded-md transition-colors duration-150 ${colorClasses[algo.color]}`}
                                    >
                                        <span className="font-semibold">
                                            {algo.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Accordion 2: Mã Hóa Công Khai */}
                    <div>
                        <button
                            onClick={() =>
                                setIsPublicMenuOpen(!isPublicMenuOpen)
                            }
                            className="flex items-center justify-between w-full text-left font-semibold text-gray-700 hover:text-blue-600 py-3 border-b border-gray-50"
                        >
                            Mã Hóa Công Khai
                            <svg
                                className={`w-4 h-4 transition-transform duration-200 ${isPublicMenuOpen ? "rotate-180" : ""}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isPublicMenuOpen ? "max-h-[400px] mt-2" : "max-h-0"}`}
                        >
                            <div className="pl-4 py-2 space-y-1 bg-gray-50 rounded-lg border border-gray-100">
                                <Link
                                    href={MaHoaCongKhai}
                                    onClick={handleLinkClick}
                                    className="block text-sm font-bold text-blue-600 py-2 mb-1 border-b border-gray-200"
                                >
                                    ➔ Trang tổng hợp Công Khai
                                </Link>
                                {publicAlgorithms.map((algo, index) => (
                                    <Link
                                        key={index}
                                        href={algo.path}
                                        onClick={handleLinkClick}
                                        className={`block py-2.5 px-2 text-sm rounded-md transition-colors duration-150 ${colorClasses[algo.color]}`}
                                    >
                                        <span className="font-semibold">
                                            {algo.name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Các nút còn lại */}
                    <Link
                        href={Modulo}
                        onClick={handleLinkClick}
                        className="block font-semibold text-gray-700 hover:text-blue-600 py-3 border-b border-gray-50"
                    >
                        Modulo
                    </Link>
                    <Link
                        href={DESCipher}
                        onClick={handleLinkClick}
                        className="block font-semibold text-gray-700 hover:text-blue-600 py-3 border-b border-gray-50"
                    >
                        DES
                    </Link>
                    <Link
                        href={AESCipher}
                        onClick={handleLinkClick}
                        className="block font-semibold text-gray-700 hover:text-blue-600 py-3 border-b border-gray-50"
                    >
                        AES
                    </Link>
                </div>
            </div>
        </header>
    );
}
