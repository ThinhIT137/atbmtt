"use client";

import { useLoading } from "@/context/LoadingContext";

const Loading = () => {
    const { loading } = useLoading();

    if (!loading) return;

    return (
        <div className="fixed inset-0 bg-gray-800/50 z-50">
            <div className="flex items-center justify-center h-full">
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        </div>
    );
};

export default Loading;
