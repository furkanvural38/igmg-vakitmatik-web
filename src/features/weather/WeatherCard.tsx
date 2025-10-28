import { type JSX, useMemo } from "react";
import clsx from "clsx";
import type { PrayerKey } from "../prayer/PrayerPanel";

export interface WeatherCardProps {
    cityName?: string;
    icon?: string;
    description?: string;
    temperatureC?: number | null;
    currentPrayer?: PrayerKey | null;
}

type Star = {
    top: string;
    left: string;
    size: string; // in px
};

/**
 * Dynamische WeatherCard, deren Hintergrund sich abhängig von der aktuellen Gebetszeit ändert.
 * Sanfter Farbwechsel + Sternenhimmel bei Nacht. Sterne sind jetzt komplett statisch.
 */
export function WeatherCard({
                                cityName,
                                icon,
                                description,
                                temperatureC,
                                currentPrayer,
                            }: WeatherCardProps): JSX.Element {
    //
    // 1. Hintergrundverlauf abhängig von der aktuellen Gebetszeit
    //
    const backgroundStyle = useMemo(() => {
        switch (currentPrayer) {
            case "fajr":
                // Vor Sonnenaufgang: sehr dunkles Blau
                return "linear-gradient(to bottom, #0a1a3d 0%, #10284e 60%, #1b3a6b 100%)";
            case "sunrise":
                // Sonnenaufgang: warme Orange- und Gelbtöne
                return "linear-gradient(to bottom, #ff8c42 0%, #ffb347 50%, #ffe29f 100%)";
            case "dhuhr":
                // Mittag: Standard-Design
                return "linear-gradient(to bottom right, #007CFF 0%, #00C0FF 50%, #00E5A0 100%)";
            case "asr":
                // Später Nachmittag: kräftiges Blau oben → helleres unten
                return "linear-gradient(to bottom, #0055cc 0%, #3399ff 70%, #a6d8ff 100%)";
            case "maghrib":
                // Sonnenuntergang: warm → kühl
                return "linear-gradient(to bottom, #ff7e5f 0%, #feb47b 40%, #355c7d 100%)";
            case "isha":
                // Nacht: fast schwarz
                return "linear-gradient(to bottom, #000010 0%, #0a0a1a 70%, #1a1a2a 100%)";
            default:
                // Fallback (Mittag)
                return "linear-gradient(to bottom right, #007CFF 0%, #00C0FF 50%, #00E5A0 100%)";
        }
    }, [currentPrayer]);

    //
    // 2. Sterne nur für "isha" (Yatsı) und "fajr" (İmsak)
    //    -> wichtig: useMemo erzeugt sie EINMAL pro Gebetswechsel,
    //       nicht bei jedem Sekundentick.
    //
    const stars: Star[] = useMemo(() => {
        const STAR_COUNT = 60;
        const arr: Star[] = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            const sizePx = (Math.random() * 2 + 1).toFixed(2); // 1px - 3px
            arr.push({
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                size: `${sizePx}px`,
            });
        }
        return arr;
    }, [currentPrayer]); // neue Sterne nur wenn wir wirklich zur nächsten Gebetsphase wechseln

    const showStars =
        currentPrayer === "isha" || currentPrayer === "fajr";

    return (
        <div
            className={clsx(
                "relative flex flex-col items-center justify-center",
                "rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]",
                "border border-[#1a1a1a] text-white flex-shrink-0",
                "w-[34rem] h-[34rem]",
                // smoother Farbwechsel beim Gebetswechsel
                "transition-all duration-[2000ms] ease-in-out"
            )}
            style={{
                background: backgroundStyle,
            }}
        >
            {/* Stern-Layer (statisch) */}
            {showStars && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {stars.map((star, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full opacity-70"
                            style={{
                                width: star.size,
                                height: star.size,
                                top: star.top,
                                left: star.left,
                                // GANZ WICHTIG: keine Animation mehr
                                animation: "none",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Stadtname */}
            <div
                className="font-semibold text-white leading-none text-center z-10"
                style={{
                    fontSize: "4.5rem",
                    lineHeight: 1.1,
                }}
            >
                {cityName ?? "—"}
            </div>

            {/* Wetter-Icon */}
            <div className="mt-4 z-10">
                {icon ? (
                    <img
                        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                        alt={description ?? ""}
                        className="w-64 h-64 object-contain"
                    />
                ) : (
                    <div className="w-64 h-64" />
                )}
            </div>

            {/* Temperatur */}
            <div
                className="font-semibold text-white leading-none text-center z-10"
                style={{
                    fontSize: "7rem",
                    lineHeight: 1.1,
                }}
            >
                {temperatureC !== null && temperatureC !== undefined
                    ? Math.round(temperatureC) + "°C"
                    : "—"}
            </div>
        </div>
    );
}
