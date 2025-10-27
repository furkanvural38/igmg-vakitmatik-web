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
    fetchWeather,
    type PrayerTimes,
    type WeatherData,
} from "../lib/api";
import { useClock } from "../hooks/useClock";
import {type DailyContentResult, fetchDailyIslamContent} from "../features/footerTicker/apiDailyContent";


export interface CityContextValue {
    cityKey: CityKey | null;
    config: CityConfig | null;
    isValidCity: boolean;

    loading: boolean;
    error: string | null;

    clock: Date;
    prayerTimes: PrayerTimes | null;
    weather: WeatherData | null;

    dailyContent: DailyContentResult | null;
}

const CityContext = createContext<CityContextValue | null>(null);

export function CityProvider({ children }: { children: React.ReactNode }) {
    const { cityKey } = useParams();
    const key = cityKey as CityKey | undefined;
    const config = key ? cityConfigs[key] : undefined;
    const isValidCity = !!config;

    const clock = useClock(1000);

    const [dailyContent, setDailyContent] = useState<DailyContentResult | null>(null);
    const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Daten laden, sobald cityKey wechselt
    useEffect(() => {
        if (!config) {
            setError("Unbekannte Stadt");
            setLoading(false);
            setPrayerTimes(null);
            setWeather(null);
            return;
        }

        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);

            try {
                // Gebetszeiten
                const pTimes = await fetchPrayerTimesWithFallback(
                    config.prayerApiUrl,
                    config.excelFallbackSheet
                );

                // Wetter (darf failen ohne alles abzubrechen)
                let wData: WeatherData | null = null;
                try {
                    wData = await fetchWeather(config.weatherCityName);
                } catch (innerErr) {
                    console.error("Weather fetch failed:", innerErr);
                }

                // Daily Islam Content
                let dContent: DailyContentResult | null = null;
                try {
                    dContent = await fetchDailyIslamContent();
                } catch (innerErr) {
                    console.error("Daily content fetch failed:", innerErr);
                }

                if (!cancelled) {
                    setPrayerTimes(pTimes);
                    setWeather(wData);
                    setDailyContent(dContent);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("CityProvider load error:", err);
                    setError("Fehler beim Laden der Daten");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }


        load();

        // Wetter ggf. periodisch neu laden (z. B. jede Stunde) → später
        return () => {
            cancelled = true;
        };
    }, [config]);

    const value = useMemo<CityContextValue>(
        () => ({
            cityKey: key ?? null,
            config: config ?? null,
            isValidCity,

            loading,
            error,

            clock,
            prayerTimes,
            weather,

            dailyContent,
        }),
        [key, config, isValidCity, loading, error, clock, prayerTimes, weather, dailyContent]
    );


    return <CityContext.Provider value={value}>{children}</CityContext.Provider>;
}

export function useCity() {
    const ctx = useContext(CityContext);
    if (!ctx) {
        throw new Error("useCity() must be used inside <CityProvider />");
    }
    return ctx;
}
