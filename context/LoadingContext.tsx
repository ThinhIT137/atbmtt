"use client";

import Loading from "@/components/loading";
import { createContext, useContext, useState } from "react";

type LoadingContextType = {
    loading: boolean;
    setLoading: (value: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | any>(null);

export const LoadingProvider = ({ children }: { children: any }) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            <Loading />
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
