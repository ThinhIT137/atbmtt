import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LoadingProvider } from "@/context/LoadingContext";
import Header from "@/components/header";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "CryptoHub by ThinhIT137 | Công Cụ Mật Mã Học",
        template: "%s | CryptoHub", // Các trang con sẽ có dạng: RSA | CryptoHub
    },
    description:
        "Tổng hợp công cụ mô phỏng và tính toán Mật mã học chi tiết từ A-Z. Bao gồm Mã hóa cổ điển (Caesar, Vigenère...), Mã hóa công khai (RSA, ElGamal, DSA, Diffie-Hellman) và tính toán Modulo.",
    keywords: [
        "Mật mã học",
        "Cryptography",
        "ThinhIT137",
        "CryptoHub",
        "RSA",
        "DSA",
        "ElGamal",
        "Diffie-Hellman",
        "Mã hóa cổ điển",
        "Caesar",
        "Vigenère",
        "Playfair",
        "Modulo",
        "An toàn thông tin",
    ],
    authors: [{ name: "ThinhIT137", url: "https://github.com/ThinhIT137" }], // Thêm link Github nếu có nhé
    creator: "ThinhIT137",

    // SEO khi share link lên Facebook, Zalo, Zalo PC...
    openGraph: {
        type: "website",
        locale: "vi_VN",
        url: "https://your-domain.com", // Đổi thành link web thật của bạn sau khi deploy (VD: Vercel)
        title: "CryptoHub by ThinhIT137 | Công Cụ Mật Mã Học Toàn Tập",
        description:
            "Hệ thống tính toán và mô phỏng các thuật toán mật mã học với các bước giải chi tiết chuẩn xác.",
        siteName: "CryptoHub",
        images: [
            {
                url: "/og-image.png", // Bạn có thể tạo 1 cái ảnh bìa đẹp đẹp vứt vào thư mục public/og-image.png
                width: 1200,
                height: 630,
                alt: "CryptoHub by ThinhIT137 Thumbnail",
            },
        ],
    },

    // SEO khi share lên Twitter/X
    twitter: {
        card: "summary_large_image",
        title: "CryptoHub by ThinhIT137",
        description:
            "Công cụ mô phỏng Mật mã học từ A-Z với các bước tính toán chi tiết.",
        images: ["/og-image.png"],
    },

    // Cho phép Google Bot index trang web
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col" suppressHydrationWarning>
                <LoadingProvider>
                    <Header />
                    {children}
                </LoadingProvider>
            </body>
        </html>
    );
}
