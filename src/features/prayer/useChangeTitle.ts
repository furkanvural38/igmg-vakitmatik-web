import { useState, useEffect } from "react";
import { useCity } from "../../app/CityProvider";

type PrayerKey = "fajr" | "sunrise" | "dhuhr" | "asr" | "maghrib" | "isha";

interface PrayerTitle {
    arabic: string;
    latin: string;
}

const prayerTitles: Record<PrayerKey, PrayerTitle> = {
    fajr: { arabic: "الصلاة الفجر", latin: "İmsak" },
    sunrise: { arabic: "الشروق", latin: "Güneş" },
    dhuhr: { arabic: "الصلاة الظهر", latin: "Öğle" },
    asr: { arabic: "الصلاة العصر", latin: "İkindi" },
    maghrib: { arabic: "الصلاة المغرب", latin: "Akşam" },
    isha: { arabic: "الصلاة العشاء", latin: "Yatsı" },
};

export function useChangeTitle() {
    const { clock } = useCity(); // globale Uhr
    const [isArabic, setIsArabic] = useState(true);
    const [currentTitles, setCurrentTitles] = useState<Record<PrayerKey, string>>(
        () =>
            Object.fromEntries(
                Object.entries(prayerTitles).map(([k, v]) => [k, v.arabic])
            ) as Record<PrayerKey, string>
    );

    useEffect(() => {
        const seconds = clock.getSeconds();
        // alle 3 Sekunden toggeln
        if (seconds % 3 === 0) {
            setIsArabic((prev) => !prev);
        }
    }, [clock]);

    useEffect(() => {
        setCurrentTitles(
            Object.fromEntries(
                Object.entries(prayerTitles).map(([k, v]) => [
                    k,
                    isArabic ? v.arabic : v.latin,
                ])
            ) as Record<PrayerKey, string>
        );
    }, [isArabic]);

    return currentTitles;
}
