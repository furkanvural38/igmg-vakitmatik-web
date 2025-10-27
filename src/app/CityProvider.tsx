// src/app/CityProvider.tsx
import React, { createContext, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { cityConfigs, type CityKey, type CityConfig } from "../lib/cities";

export interface CityContextValue {
    cityKey: CityKey | null;
    config: CityConfig | null;
    isValidCity: boolean;
}

const CityContext = createContext<CityContextValue | null>(null);

export function CityProvider({ children }: { children: React.ReactNode }) {
    const { cityKey } = useParams();

    const value = useMemo<CityContextValue>(() => {
        // wir casten mal vorsichtig
        const key = cityKey as CityKey | undefined;
        const cfg = key ? cityConfigs[key] : undefined;

        return {
            cityKey: key ?? null,
            config: cfg ?? null,
            isValidCity: !!cfg,
        };
    }, [cityKey]);

    return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
    const ctx = useContext(CityContext);
    if (!ctx) {
        throw new Error("useCity() must be used inside <CityProvider />");
    }
    return ctx;
}
