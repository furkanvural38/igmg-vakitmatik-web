// src/features/prayer/PrayerPanel.tsx
import { useCity } from "../../app/CityProvider";
import { usePrayerTimeLogic } from "./usePrayerTimeLogic";

const LABELS: Record<string, string> = {
    fajr: "Fajr",
    sunrise: "Güneş", // kannst du auch "Sunrise" nennen
    dhuhr: "Öğle",
    asr: "İkindi",
    maghrib: "Akşam",
    isha: "Yatsı",
};

export function PrayerPanel() {
    const { clock, prayerTimes } = useCity();
    const {
        currentPrayerKey,
        timeDifference,
        progressPercentage,
    } = usePrayerTimeLogic(clock, prayerTimes);

    // Farbe Fortschrittsbalken
    const barColorClass =
        progressPercentage > 90 ? "bg-red-500" : "bg-[#009972]";

    return (
        <section className="flex flex-col items-center justify-start text-white w-full max-w-[3000px]">
            {/* Countdown / Fortschritt */}
            <div className="flex flex-col items-center mb-24">
                <div className="text-center text-white mb-8 text-8xl font-bold tracking-tight">
                    {timeDifference}
                </div>

                <div className="w-[1200px] h-10 bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                    <div
                        className={`h-full ${barColorClass} transition-all duration-500`}
                        style={{
                            width: `${Math.min(
                                100,
                                Math.max(0, progressPercentage)
                            )}%`,
                        }}
                    />
                </div>

                <div className="text-neutral-400 text-3xl mt-4 font-light tracking-wide">
                    verbleibende Zeit bis zum nächsten Gebet
                </div>
            </div>

            {/* Grid der Gebetszeiten */}
            <div className="grid grid-cols-6 gap-8 text-center">
                {prayerTimes ? (
                    Object.entries(prayerTimes).map(([key, value]) => {
                        // wir ignorieren evtl. zusätzliche Felder, falls vorhanden
                        if (!(key in LABELS)) return null;

                        const isActive = key === currentPrayerKey;

                        return (
                            <div
                                key={key}
                                className={[
                                    "relative flex flex-col items-center justify-center",
                                    "rounded-2xl px-8 py-10",
                                    "w-[260px] h-[220px]",
                                    "border-4",
                                    isActive
                                        ? "bg-neutral-900 border-[#009972] shadow-[0_0_60px_rgba(0,153,114,0.5)]"
                                        : "bg-neutral-800 border-neutral-700 shadow-[0_0_40px_rgba(0,0,0,0.8)]",
                                ].join(" ")}
                            >
                                {/* Label */}
                                <div
                                    className={`text-4xl font-medium tracking-wide ${
                                        isActive ? "text-[#009972]" : "text-neutral-400"
                                    }`}
                                >
                                    {LABELS[key]}
                                </div>

                                {/* Uhrzeit */}
                                <div className="text-7xl font-bold text-white leading-tight mt-4">
                                    {value || "--:--"}
                                </div>

                                {/* Markierung "AKTIV" */}
                                {isActive && (
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#009972] text-black text-3xl font-bold rounded-xl px-6 py-2 shadow-[0_0_20px_rgba(0,153,114,0.8)] border border-black/40 uppercase tracking-wide">
                                        AKTIV
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-6 text-neutral-500 text-5xl font-light">
                        keine Daten
                    </div>
                )}
            </div>
        </section>
    );
}
