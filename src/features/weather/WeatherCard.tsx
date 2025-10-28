import { type JSX } from "react";

const GRADIENT_BG =
    "linear-gradient(to bottom right, #007CFF 0%, #00C0FF 50%, #00E5A0 100%)";

export interface WeatherCardProps {
    cityName?: string;
    icon?: string;
    description?: string;
    temperatureC?: number | null;
}

export function WeatherCard({
                                cityName,
                                icon,
                                description,
                                temperatureC,
                            }: WeatherCardProps): JSX.Element {
    return (
        <div
            className="
                flex flex-col items-center justify-center
                rounded-3xl
                shadow-[0_20px_60px_rgba(0,0,0,0.8)]
                border border-[#1a1a1a]
                text-white
                flex-shrink-0
                w-[34rem] h-[34rem]
            "
            style={{
                background: GRADIENT_BG,
            }}
        >
            {/* Stadtname */}
            <div
                className="font-semibold text-white leading-none text-center"
                style={{
                    fontSize: "4.5rem",
                    lineHeight: 1.1,
                }}
            >
                {cityName ?? "—"}
            </div>

            {/* Wetter-Icon */}
            <div className="mt-4">
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
                className="font-semibold text-white leading-none text-center"
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
