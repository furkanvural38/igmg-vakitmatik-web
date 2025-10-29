import { type JSX, useMemo } from "react";
import { useCity } from "../../app/CityProvider";
import { usePrayerTimeLogic } from "./usePrayerTimeLogic";

import { FaMoon } from "react-icons/fa6";
import { HiOutlineSun } from "react-icons/hi";
import { AiFillSun } from "react-icons/ai";
import { PiSunHorizonFill, PiSunHorizonLight } from "react-icons/pi";
import { LuCloudSun } from "react-icons/lu";

import { useChangeTitle } from "./useChangeTitle";
import { WeatherCard } from "../weather/WeatherCard";

const GREEN = "#009972";
const DANGER = "#ff3b30";

export type PrayerKey =
    | "fajr"
    | "sunrise"
    | "dhuhr"
    | "asr"
    | "maghrib"
    | "isha";

const ICONS: Record<PrayerKey, JSX.Element> = {
    fajr: <PiSunHorizonLight className="mb-2 text-4xl" />,
    sunrise: <HiOutlineSun className="mb-2 text-4xl" />,
    dhuhr: <AiFillSun className="mb-2 text-4xl" />,
    asr: <LuCloudSun className="mb-2 text-4xl" />,
    maghrib: <PiSunHorizonFill className="mb-2 text-4xl" />,
    isha: <FaMoon className="mb-2 text-4xl" />,
};

export function PrayerPanel(): JSX.Element {
    const { clock, prayerTimes, weather } = useCity();

    const { currentPrayer, diffLabelShort, progressPercentage } =
        usePrayerTimeLogic(clock, prayerTimes);

    const titles = useChangeTitle();

    // Uhrzeit HH:MM:SS
    const timeParts = useMemo(() => {
        const hh = clock.getHours().toString().padStart(2, "0");
        const mm = clock.getMinutes().toString().padStart(2, "0");
        const ss = clock.getSeconds().toString().padStart(2, "0");
        return { hh, mm, ss };
    }, [clock]);

    // Datum (gregorianisch)
    const gregorianDate = useMemo(() => {
        const d = clock;
        const dd = d.getDate().toString().padStart(2, "0");
        const mo = (d.getMonth() + 1).toString().padStart(2, "0");
        const yyyy = d.getFullYear().toString();
        return `${dd}.${mo}.${yyyy}`;
    }, [clock]);

    // Hijri-Datum
    const hijriDate = prayerTimes?.hijriDateLong ?? "--";

    // aktive Farbe
    const activeBgColor = progressPercentage > 90 ? DANGER : GREEN;

    // Türkische Labels
    const PRAYER_LABELS: Record<PrayerKey, string> = {
        fajr: "İmsak",
        sunrise: "Güneş",
        dhuhr: "Öğle",
        asr: "İkindi",
        maghrib: "Akşam",
        isha: "Yatsı",
    };

    //
    // Helpers für Tile
    //
    function tileClasses(isActive: boolean): string {
        const base = [
            "relative flex flex-col items-center text-center",
            "glass-card",
            "rounded-2xl",
            "px-4 py-4",
        ];

        if (isActive) {
            base.push("glass-animate-in");
        }

        return base.join(" ");
    }

    function tileInnerStyles(isActive: boolean): React.CSSProperties {
        if (isActive) {
            return {
                background:
                    activeBgColor === DANGER
                        ? "radial-gradient(circle at 50% 50%, rgba(255,59,48,0.15) 0%, rgba(0,0,0,0) 70%)"
                        : "radial-gradient(circle at 50% 50%, rgba(0,153,114,0.15) 0%, rgba(0,0,0,0) 70%)",
                transition: "background 0.4s ease",
            };
        }
        return {};
    }

    return (
        <div
            className="
                w-full
                flex flex-col
                items-stretch
                text-white
                select-none
                relative
                z-[1]
                max-w-screen-xl
                mx-auto
                gap-12
            "
        >
            {/* 1. TOP ROW: Datum / Uhr / Wetter */}
            <div
                className="
                    flex flex-row
                    flex-wrap
                    items-start
                    justify-between
                    w-full
                    gap-8
                "
            >
                {/* Datum-Block */}
                <div className="flex flex-col gap-4 min-w-[220px]">
                    {/* Gregorianisches Datum */}
                    <div
                        className="
                            glass-card glass-animate-in glass-card-content
                            flex items-center justify-center text-center
                            text-white font-semibold
                            rounded-xl shadow-lg
                            px-4 py-3
                        "
                        style={{
                            fontSize: "1.5rem",
                            lineHeight: 1.2,
                            backgroundColor: `${GREEN}40`,
                        }}
                    >
                        {gregorianDate}
                    </div>

                    {/* Hijri-Datum */}
                    <div
                        className="
                            glass-card glass-card-content
                            flex items-center justify-center text-center
                            text-white font-light
                            rounded-xl shadow-md
                            px-4 py-3
                        "
                        style={{
                            fontSize: "1.25rem",
                            lineHeight: 1.2,
                            borderColor: "rgba(255,255,255,0.3)",
                        }}
                    >
                        {hijriDate}
                    </div>
                </div>

                {/* Uhr */}
                <div
                    className="
                        flex flex-row
                        items-end
                        justify-center
                        text-white
                        font-extrabold
                        tracking-tight
                        text-center
                        leading-none
                        flex-grow
                        min-w-[260px]
                        basis-auto
                    "
                    style={{
                        fontFamily: "'Bebas Neue', sans-serif",
                    }}
                >
                    <div
                        className="
                            leading-[0.9]
                            font-extrabold
                            text-[8rem]
                        "
                        style={{ lineHeight: 0.8 }}
                    >
                        {timeParts.hh}:{timeParts.mm}
                    </div>
                    <div
                        className="
                            leading-[0.9]
                            ml-2
                            font-extrabold
                            text-[4rem]
                            text-white/80
                        "
                        style={{ lineHeight: 0.9 }}
                    >
                        {timeParts.ss}
                    </div>
                </div>

                {/* Wetter */}
                <div className="flex-shrink-0 min-w-[220px]">
                    <WeatherCard
                        cityName={weather?.name}
                        icon={weather?.weather?.[0]?.icon}
                        description={weather?.weather?.[0]?.description}
                        temperatureC={weather?.main?.temp}
                        currentPrayer={currentPrayer}
                    />
                </div>
            </div>

            {/* 2. GEBETSZEIT-KACHELN */}
            <div
                className="
                    w-full
                    overflow-x-auto
                "
                style={{
                    // verhindert, dass Grid unter ~1200px die Spalten zusammenquetscht
                    // 6 Karten * 200px Mindestbreite + 5 Gaps * 1.5rem (24px) bei gap-6
                    minWidth: `calc((200px * 6) + (24px * 5))`,
                }}
            >
                <div
                    className="
                        grid
                        grid-cols-6
                        gap-6
                        justify-items-stretch
                    "
                >
                    {!prayerTimes ? (
                        <div className="text-lg text-neutral-400 col-span-6">
                            Lade Gebetszeiten…
                        </div>
                    ) : (
                        (Object.keys(PRAYER_LABELS) as PrayerKey[]).map(
                            (key) => {
                                const isActive = currentPrayer === key;
                                const timeVal =
                                    prayerTimes[
                                        key as keyof typeof PRAYER_LABELS
                                        ] ?? "00:00";

                                return (
                                    <div
                                        key={key}
                                        className={tileClasses(isActive)}
                                        style={{
                                            ...tileInnerStyles(isActive),
                                            minWidth: "200px", // wichtig für mobile Scroll-Layout
                                        }}
                                    >
                                        {/* Fortschritt / Countdown oberhalb der aktiven Kachel */}
                                        {isActive && (
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full px-2 text-white z-[5] flex flex-col items-center">
                                                <div className="text-center text-white mb-2 text-2xl font-semibold">
                                                    {diffLabelShort}
                                                </div>

                                                <div
                                                    className={`
                                                        w-full rounded-2xl overflow-hidden glass-text
                                                        ${
                                                        progressPercentage >
                                                        90
                                                            ? "bg-red-500"
                                                            : "bg-[#009972]"
                                                    }
                                                    `}
                                                    style={{
                                                        height: "0.75rem",
                                                    }}
                                                >
                                                    <div
                                                        className="bg-[#4b4b4b] h-full rounded-2xl"
                                                        style={{
                                                            width: `${progressPercentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Icon */}
                                        <div
                                            className={
                                                isActive
                                                    ? "text-white"
                                                    : "text-[#a7a7a7]"
                                            }
                                        >
                                            {ICONS[key]}
                                        </div>

                                        {/* dynamischer (arabisch/latein) Name */}
                                        <span
                                            className={`${
                                                isActive
                                                    ? "text-white"
                                                    : "text-[#a7a7a7]"
                                            } text-base mb-1`}
                                        >
                                            {titles[key] ?? "-"}
                                        </span>

                                        {/* Türkischer Name */}
                                        <span
                                            className={`${
                                                isActive
                                                    ? "text-white"
                                                    : "text-[#a7a7a7]"
                                            } text-2xl font-semibold`}
                                        >
                                            {PRAYER_LABELS[key]}
                                        </span>

                                        {/* Uhrzeit */}
                                        <span
                                            className={`${
                                                isActive
                                                    ? "text-white"
                                                    : "text-[#a7a7a7]"
                                            } font-semibold mt-2 text-4xl leading-none`}
                                        >
                                            {timeVal}
                                        </span>
                                    </div>
                                );
                            }
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
