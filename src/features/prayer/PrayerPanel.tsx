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

export type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

const ICONS: Record<PrayerKey, JSX.Element> = {
    fajr: <PiSunHorizonLight className="text-9xl mb-4" />,
    sunrise: <HiOutlineSun className="text-9xl mb-4" />,
    dhuhr: <AiFillSun className="text-9xl mb-4" />,
    asr: <LuCloudSun className="text-9xl mb-4" />,
    maghrib: <PiSunHorizonFill className="text-9xl mb-4" />,
    isha: <FaMoon className="text-9xl mb-4" />,
};

export function PrayerPanel(): JSX.Element {
    const { clock, prayerTimes, weather } = useCity();

    const { currentPrayer, diffLabelShort, progressPercentage } =
        usePrayerTimeLogic(clock, prayerTimes);

    const titles = useChangeTitle();

    // Uhrzeit HH:MM:SS für die große Uhr
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

    // Hijri-Datum (kommt aus prayerTimes)
    const hijriDate = prayerTimes?.hijriDateLong ?? "--";

    // aktive Farbe (grün normal, rot wenn >90%)
    const activeBgColor = progressPercentage > 90 ? DANGER : GREEN;

    // türkische Labels für die einzelnen Gebete
    const PRAYER_LABELS: Record<PrayerKey, string> = {
        fajr: "İmsak",
        sunrise: "Güneş",
        dhuhr: "Öğle",
        asr: "İkindi",
        maghrib: "Akşam",
        isha: "Yatsı",
    };

    //
    // Hilfsfunktionen für Styling der Gebets-Kacheln
    //
    function tileClasses(isActive: boolean): string {
        const base = [
            "relative flex flex-col justify-center items-center",
            "rounded-3xl shadow-lg",
            "w-[34rem] h-[34rem]",
            "mt-30",
        ].join(" ");

        if (isActive) {
            return base + " text-white";
        }

        return (
            base +
            " bg-[#343434] text-white border border-[#5a5a5a]"
        );
    }

    function tileInnerStyles(isActive: boolean): React.CSSProperties {
        if (isActive) {
            return {
                backgroundColor: activeBgColor,
            };
        }
        return {};
    }

    return (
        <div className="w-full flex flex-col items-stretch text-white select-none">
            {/* 1. OBERER BLOCK: Datum / Uhr / Wetter */}
            <div className="flex flex-row items-center justify-between w-full px-10">
                {/* Datum links */}
                <div className="flex flex-col min-w-[400px]">
                    <div
                        className="rounded-2xl px-8 py-6 text-white text-center font-semibold mb-6 shadow-lg"
                        style={{
                            backgroundColor: GREEN,
                            fontSize: "6rem",
                            lineHeight: 1.1,
                        }}
                    >
                        {gregorianDate}
                    </div>
                    <div
                        className="rounded-2xl border border-white bg-black/60 px-8 py-6 text-white text-center font-light shadow-md"
                        style={{
                            fontSize: "5rem",
                            lineHeight: 1.1,
                        }}
                    >
                        {hijriDate}
                    </div>
                </div>

                {/* Uhrzeit in der Mitte */}
                <div className="flex flex-row font-bebas text-clock items-end justify-center text-white leading-none font-extrabold tracking-tight text-center">
                    <div className="text-clock leading-[0.8]">
                        {timeParts.hh}:{timeParts.mm}
                    </div>
                    <div className="text-seconds leading-[0.9] ml-2">
                        {timeParts.ss}
                    </div>
                </div>

                {/* Wetter rechts (ausgelagert) */}
                <WeatherCard
                    cityName={weather?.name}
                    icon={weather?.weather?.[0]?.icon}
                    description={weather?.weather?.[0]?.description}
                    temperatureC={weather?.main?.temp}
                    currentPrayer={currentPrayer} // 🔥 diese Zeile neu!
                />

            </div>

            {/* 2. GEBETSZEIT-KACHELN */}
            <div
                className="
                    w-full
                    flex flex-row
                    justify-between
                    items-start
                    px-10
                    mt-24
                    gap-10
                "
            >
                {!prayerTimes ? (
                    <div className="text-2xl text-neutral-400">
                        Lade Gebetszeiten…
                    </div>
                ) : (
                    (Object.keys(PRAYER_LABELS) as PrayerKey[]).map(
                        (key) => {
                            const isActive = currentPrayer === key;
                            const timeVal =
                                (prayerTimes as Record<string, string>)[key] ??
                                "00:00";

                            return (
                                <div
                                    key={key}
                                    className={tileClasses(isActive)}
                                    style={tileInnerStyles(isActive)}
                                >
                                    {/* Countdown + Fortschritt über aktiver Kachel */}
                                    {isActive && (
                                        <div className="absolute -top-44 left-1/2 -translate-x-1/2 w-full px-4 text-white">
                                            {/* verbleibende Zeit */}
                                            <div className="text-center text-white mb-4 text-8xl">
                                                {diffLabelShort}
                                            </div>

                                            {/* Fortschrittsbalken */}
                                            <div
                                                className={`h-8 relative w-full rounded-3xl overflow-hidden ${
                                                    progressPercentage > 90
                                                        ? "bg-red-500"
                                                        : "bg-[#009972]"
                                                }`}
                                            >
                                                <div
                                                    className="bg-[#4b4b4b] rounded-3xl h-full"
                                                    style={{
                                                        width: `${progressPercentage}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div
                                        className={`${
                                            isActive
                                                ? "text-white"
                                                : "text-[#a7a7a7]"
                                        } text-8xl mb-4`}
                                    >
                                        {ICONS[key]}
                                    </div>

                                    {/* rotierender Titel arabisch/latein */}
                                    <span
                                        className={`${
                                            isActive
                                                ? "text-white"
                                                : "text-[#a7a7a7]"
                                        } text-6xl mb-6`}
                                    >
                                        {titles[key] ?? "-"}
                                    </span>

                                    {/* statischer Name wie İmsak / Güneş / ... */}
                                    <span
                                        className={`${
                                            isActive
                                                ? "text-white"
                                                : "text-[#a7a7a7]"
                                        } text-8xl font-semibold`}
                                    >
                                        {PRAYER_LABELS[key]}
                                    </span>

                                    {/* Uhrzeit */}
                                    <span
                                        className={`${
                                            isActive
                                                ? "text-white"
                                                : "text-[#a7a7a7]"
                                        } font-semibold mt-4 text-[7rem] leading-none`}
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
    );
}
