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
    size: string; // px
};

export function WeatherCard({
                                cityName,
                                icon,
                                description,
                                temperatureC,
                                currentPrayer,
                            }: WeatherCardProps): JSX.Element {
    // dynamischer Hintergrund basierend auf currentPrayer
    const backgroundStyle = useMemo(() => {
        switch (currentPrayer) {
            case "fajr":
                return "linear-gradient(to bottom, #0a1a3d 0%, #10284e 60%, #1b3a6b 100%)";
            case "sunrise":
                return `
                    radial-gradient(
                        ellipse at top center,
                        rgba(255,220,180,0.25) 0%,
                        transparent 70%
                    ),
                    linear-gradient(
                        to bottom,
                        #7a3e1d 0%,
                        #b86b2a 45%,
                        #e5b56a 100%
                    )
                `;
            case "dhuhr":
                return "linear-gradient(to bottom right, #007CFF 0%, #00C0FF 50%, #00E5A0 100%)";
            case "asr":
                return "linear-gradient(to bottom, #0055cc 0%, #3399ff 70%, #a6d8ff 100%)";
            case "maghrib":
                return "linear-gradient(to bottom, #ff7e5f 0%, #feb47b 40%, #355c7d 100%)";
            case "isha":
                return "linear-gradient(to bottom, #000010 0%, #0a0a1a 70%, #1a1a2a 100%)";
            default:
                return "linear-gradient(to bottom right, #007CFF 0%, #00C0FF 50%, #00E5A0 100%)";
        }
    }, [currentPrayer]);

    // Sterne für Nachtphasen
    const stars: Star[] = useMemo(() => {
        const STAR_COUNT = 40;
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
    }, [currentPrayer]);

    const showStars = currentPrayer === "isha" || currentPrayer === "fajr";

    return (
        <div
            className={clsx(
                // gleiche äußere Box wie Prayer-Tile:
                "relative flex flex-col items-center text-center",
                "glass-card rounded-2xl px-4 py-4 flex-1",
                "min-w-[200px] max-w-[240px]",
                "glass-animate-in",
                "transition-all duration-[2000ms] ease-in-out",
            )}
            style={{
                background: backgroundStyle,
            }}
        >
            {/* Stern-Layer (nur Nacht) */}
            {showStars && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
                    {stars.map((star, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full opacity-70"
                            style={{
                                width: star.size,
                                height: star.size,
                                top: star.top,
                                left: star.left,
                                boxShadow: "0 0 6px rgba(255,255,255,0.6)",
                            }}
                        />
                    ))}
                </div>
            )}

            {/* Inhalt */}
            <div className="glass-card-content flex flex-col items-center justify-start text-white text-center z-[2] w-full">
                {/* Stadtname */}
                <div className="font-semibold text-white leading-tight text-xl">
                    {cityName ?? "—"}
                </div>

                {/* Icon */}
                <div className="mt-2 flex items-center justify-center">
                    {icon ? (
                        <img
                            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                            alt={description ?? ""}
                            className="w-16 h-16 object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
                        />
                    ) : (
                        <div className="w-16 h-16" />
                    )}
                </div>

                {/* Temperatur */}
                <div className="font-semibold leading-none text-4xl mt-2">
                    {temperatureC !== null && temperatureC !== undefined
                        ? `${Math.round(temperatureC)}°C`
                        : "—"}
                </div>

                {/* Beschreibung, klein drunter */}
                {description ? (
                    <div className="text-white/80 text-sm font-light mt-1 leading-snug">
                        {description}
                    </div>
                ) : null}
            </div>
        </div>
    );
}
