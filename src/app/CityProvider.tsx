// src/app/CityProvider.tsx
import React, {
    createContext,
    useContext,
    useMemo,
    useEffect,
    useState,
} from "react";
import { useParams } from "react-router-dom";
import { cityConfigs, type CityKey, type CityConfig } from "../lib/cities";
import {
    fetchPrayerTimesWithFallback,
    fetchWeather, type PrayerTimes, type WeatherData,
} from "../lib/api";
import { fetchDailyIslamContent} from "../features/footerTicker/apiDailyContent";

interface CityContextValue {
    cityKey: CityKey | string;
    config?: CityConfig;
    isValidCity: boolean;
    loading: boolean;
    error: string | null;
    clock: Date;
    prayerTimes: any | null;
    weather: any | null;
    dailyContent: any | null;
}

const CityContext = createContext<CityContextValue | undefined>(undefined);

export function CityProvider({ children }: { children: React.ReactNode }) {
    const { cityKey = "" } = useParams();
    const [clock, setClock] = useState(new Date());
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes  | null>(null);
    const [weather, setWeather] = useState<WeatherData  | null>(null);
    const [dailyContent, setDailyContent] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // city config
    const config = useMemo(() => {
        return cityConfigs[cityKey as keyof typeof cityConfigs];
    }, [cityKey]);

    const isValidCity = !!config;

    // clock ticker
    useEffect(() => {
        const id = setInterval(() => {
            setClock(new Date());
        }, 1000);
        return () => clearInterval(id);
    }, []);

    // daten laden wenn city valid
    useEffect(() => {
        if (!isValidCity) {
            setError("Ungültige Stadt");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        (async () => {
            try {
                // ⬇ diese drei Zeilen sind die Kandidaten für TS18048:
                //    config könnte theoretisch undefined sein.
                const [prayer, weatherResp, daily] = await Promise.all([
                    fetchPrayerTimesWithFallback(config!.prayerApiUrl),
                    fetchWeather(config!.weatherCityName),
                    fetchDailyIslamContent(),
                ]);

                setPrayerTimes(prayer);
                setWeather(weatherResp);
                setDailyContent(daily);
            } catch (err: any) {
                setError(err?.message ?? "Fehler beim Laden");
            } finally {
                setLoading(false);
            }
        })();
    }, [isValidCity, config]);

    const value: CityContextValue = {
        cityKey,
        config,
        isValidCity,
        loading,
        error,
        clock,
        prayerTimes,
        weather,
        dailyContent,
    };

    return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
    const ctx = useContext(CityContext);
    if (!ctx) {
        throw new Error("useCity must be used within CityProvider");
    }
    return ctx;
}