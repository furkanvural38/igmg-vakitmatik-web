import React, { useMemo } from "react";
import { useCity } from "../../app/CityProvider";
import { usePrayerTimeLogic } from "./usePrayerTimeLogic";

import { FaMoon } from "react-icons/fa6";
import { HiOutlineSun } from "react-icons/hi";
import { AiFillSun } from "react-icons/ai";
import { PiSunHorizonFill, PiSunHorizonLight } from "react-icons/pi";
import { LuCloudSun } from "react-icons/lu";

import { useChangeTitle } from "./useChangeTitle";

const GREEN = "#009972";
const DANGER = "#ff3b30";

type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

const ICONS: Record<PrayerKey, JSX.Element> = {
    fajr: <PiSunHorizonLight className="text-6xl mb-2" />,
    sunrise: <HiOutlineSun className="text-6xl mb-2" />,
    dhuhr: <AiFillSun className="text-6xl mb-2" />,
    asr: <LuCloudSun className="text-6xl mb-2" />,
    maghrib: <PiSunHorizonFill className="text-6xl mb-2" />,
    isha: <FaMoon className="text-6xl mb-2" />,
};

export function PrayerPanel() {
    const { clock, prayerTimes, weather } = useCity();

    const {
        currentPrayer,
        diffLabelShort,
        progressPercentage,
    } = usePrayerTimeLogic(clock, prayerTimes);

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

    // TODO später dynamisch aus API
    const hijriDate = "5 CemaziyelEvvel 1447";

    // aktive Farbe (grün normal, rot wenn >90%)
    const activeBgColor = progressPercentage > 90 ? DANGER : GREEN;

    function tileClasses(isActive: boolean) {
        if (isActive) {
            return [
                "relative flex flex-col justify-center items-center",
                "rounded-xl shadow-lg px-6 py-4",
                "text-white",
            ].join(" ");
        }
        return [
            "relative flex flex-col justify-center items-center",
            "rounded-xl shadow-lg px-6 py-4",
            "bg-[#343434] text-white border border-[#5a5a5a]",
        ].join(" ");
    }

    function tileInnerStyles(isActive: boolean) {
        if (isActive) {
            return {
                backgroundColor: activeBgColor,
                boxShadow:
                    progressPercentage > 90
                        ? "0 0 20px rgba(255,59,48,0.7)"
                        : "0 0 20px rgba(0,153,114,0.7)",
            };
        }
        return {};
    }

    return (
        <div className="w-full flex flex-col items-center text-white select-none">
            {/* 1. OBERER BLOCK: Datum / Uhr / Wetter */}
            <div className="flex flex-row items-start justify-between w-full max-w-[1800px] mb-10 gap-8 px-4">
                {/* Datum links */}
                <div className="flex flex-col min-w-[260px]">
                    <div
                        className="rounded-md px-4 py-2 text-2xl font-bold text-white text-center"
                        style={{ backgroundColor: GREEN }}
                    >
                        {gregorianDate}
                    </div>
                    <div className="rounded-md border border-[#5a5a5a] bg-black/60 px-4 py-2 text-2xl font-light text-white text-center mt-2">
                        {hijriDate}
                    </div>
                </div>

                {/* Uhrzeit in der Mitte */}
                <div className="flex flex-row items-end justify-center text-white leading-none font-extrabold tracking-tight text-center">
                    <div className="text-[120px] leading-[0.8]">
                        {timeParts.hh}:{timeParts.mm}
                    </div>
                    <div className="text-[64px] leading-[0.9] ml-2">
                        {timeParts.ss}
                    </div>
                </div>

                {/* Wetter rechts (ohne Countdown/Balken) */}
                <div
                    className="flex flex-col rounded-md text-white w-[220px] px-4 py-4 shadow-[0_0_30px_rgba(0,0,0,0.8)] border border-[#1a1a1a]"
                    style={{
                        background:
                            "linear-gradient(to bottom right, #007CFF 0%, #00C0FF 50%, #00E5A0 100%)",
                    }}
                >
                    <div className="text-2xl font-bold leading-tight">
                        {weather?.name ?? "—"}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                        {weather?.weather?.[0]?.icon ? (
                            <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt={weather.weather[0].description}
                                className="w-10 h-10 object-contain"
                            />
                        ) : (
                            <div className="w-10 h-10" />
                        )}

                        <div className="text-3xl font-semibold leading-none">
                            {weather ? Math.round(weather.main.temp) + "°C" : "—"}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. GEBETSZEIT-KACHELN */}
            <div className="flex flex-row items-start justify-center gap-4 flex-wrap w-full max-w-[1800px]">
                {!prayerTimes ? (
                    <div className="text-2xl text-neutral-400">
                        Lade Gebetszeiten…
                    </div>
                ) : (
                    (Object.keys(titles) as PrayerKey[]).map((key) => {
                        const isActive = currentPrayer === key;
                        const timeVal = (prayerTimes as any)[key] ?? "--:--";

                        return (
                            <div
                                key={key}
                                className={tileClasses(isActive)}
                                style={tileInnerStyles(isActive)}
                            >
                                {/* Countdown+Progress gehören über die AKTIVE Kachel */}
                                {isActive && (
                                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full px-4 text-white">
                                        {/* diffLabelShort wie "7h 53min" */}
                                        <div className="text-center font-bold text-4xl mb-2">
                                            {diffLabelShort}
                                        </div>

                                        {/* Fortschrittsbalken */}
                                        <div className="w-full">
                                            <div className="h-2 rounded-full bg-[#4b4b4b] overflow-hidden relative">
                                                <div
                                                    className="absolute left-0 top-0 h-full rounded-full"
                                                    style={{
                                                        width: `${progressPercentage}%`,
                                                        backgroundColor:
                                                            progressPercentage > 90 ? DANGER : GREEN,
                                                        boxShadow:
                                                            progressPercentage > 90
                                                                ? "0 0 15px rgba(255,59,48,0.7)"
                                                                : "0 0 15px rgba(0,153,114,0.7)",
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Icon */}
                                <div
                                    className={
                                        "mb-2 " +
                                        (isActive ? "text-white" : "text-[#a7a7a7]")
                                    }
                                >
                                    {ICONS[key]}
                                </div>

                                {/* dynamischer Titel (arabisch / türkisch rotiert) */}
                                <div
                                    className={
                                        "text-3xl font-semibold mb-1 text-center " +
                                        (isActive ? "text-white" : "text-[#a7a7a7]")
                                    }
                                >
                                    {titles[key]}
                                </div>

                                {/* Zeit */}
                                <div
                                    className={
                                        "text-4xl font-bold text-center " +
                                        (isActive ? "text-white" : "text-[#a7a7a7]")
                                    }
                                >
                                    {timeVal}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
