// src/features/prayer/usePrayerTimeLogic.ts
import { useMemo } from "react";
import type {PrayerTimes} from "../../lib/api";

export interface PrayerPhaseInfo {
    currentPrayerKey: string | null;
    nextPrayerKey: string | null;
    timeDifference: string;      // "01:23:45" bis nächste Phase
    progressPercentage: number;  // 0..100 wie weit aktuelle Phase fortgeschritten ist
}

function toMinutesFromMidnight(timeStr: string | undefined | null) {
    if (!timeStr) return null;
    const [hh, mm] = timeStr.split(":").map((n) => Number(n));
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return hh * 60 + mm;
}

// formatiert Sekunden-Differenz hübsch als HH:MM:SS
function formatDiffSeconds(totalSecondsRaw: number) {
    const totalSeconds = totalSecondsRaw < 0 ? 0 : Math.floor(totalSecondsRaw);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function usePrayerTimeLogic(clock: Date, prayerTimes: PrayerTimes | null): PrayerPhaseInfo {
    return useMemo(() => {
        if (!prayerTimes) {
            return {
                currentPrayerKey: null,
                nextPrayerKey: null,
                timeDifference: "--:--:--",
                progressPercentage: 0,
            };
        }

        // Zeitplan als Sequenz
        // Reihenfolge ist wichtig – wir benutzen sie, um Intervalle zu bestimmen
        const schedule = [
            { key: "fajr",     label: "Fajr",     start: toMinutesFromMidnight(prayerTimes.fajr) },
            { key: "sunrise",  label: "Sunrise",  start: toMinutesFromMidnight(prayerTimes.sunrise) },
            { key: "dhuhr",    label: "Dhuhr",    start: toMinutesFromMidnight(prayerTimes.dhuhr) },
            { key: "asr",      label: "Asr",      start: toMinutesFromMidnight(prayerTimes.asr) },
            { key: "maghrib",  label: "Maghrib",  start: toMinutesFromMidnight(prayerTimes.maghrib) },
            { key: "isha",     label: "Isha",     start: toMinutesFromMidnight(prayerTimes.isha) },
        ];

        // aktuelle Zeit in Minuten/ Sekunden
        const nowMins = clock.getHours() * 60 + clock.getMinutes();
        const nowSecsTotal = clock.getHours() * 3600 + clock.getMinutes() * 60 + clock.getSeconds();

        // aktives Intervall finden
        // Regel: wir schauen zwischen [i, i+1)
        let activeIndex = -1;
        for (let i = 0; i < schedule.length - 1; i++) {
            const cur = schedule[i].start;
            const nxt = schedule[i + 1].start;
            if (cur != null && nxt != null && nowMins >= cur && nowMins < nxt) {
                activeIndex = i;
                break;
            }
        }

        // Falls wir nach isha sind -> letzte Phase "isha" aktiv
        if (activeIndex === -1) {
            activeIndex = schedule.length - 1;
        }

        const current = schedule[activeIndex];
        const next = schedule[activeIndex + 1] ?? null;

        // Fortschritt berechnen
        let progressPercentage = 0;
        if (current?.start != null) {
            const currentStartSecs = current.start * 60;
            let nextStartSecs: number | null = null;
            if (next?.start != null) nextStartSecs = next.start * 60;

            if (nextStartSecs != null && nextStartSecs > currentStartSecs) {
                const totalDur = nextStartSecs - currentStartSecs;
                const passed = nowSecsTotal - currentStartSecs;
                progressPercentage = totalDur > 0 ? (passed / totalDur) * 100 : 100;
            } else {
                // kein nächster Slot (also nach isha bis Mitternacht)
                // berechne Fortschritt relativ zu Mitternacht
                const midnightSecs = 24 * 60 * 60;
                const totalDur = midnightSecs - currentStartSecs;
                const passed = nowSecsTotal - currentStartSecs;
                progressPercentage = totalDur > 0 ? (passed / totalDur) * 100 : 100;
            }
        }

        // Countdown zur nächsten Phase
        let diffSecondsToNext = 0;
        if (next?.start != null) {
            const nextStartSecs = next.start * 60;
            diffSecondsToNext = nextStartSecs - nowSecsTotal;
        } else {
            // nach isha → Countdown bis 24:00
            const midnightSecs = 24 * 60 * 60;
            diffSecondsToNext = midnightSecs - nowSecsTotal;
        }

        const timeDifference = formatDiffSeconds(diffSecondsToNext);

        return {
            currentPrayerKey: current?.key ?? null,
            nextPrayerKey: next?.key ?? null,
            timeDifference,
            progressPercentage,
        };
    }, [clock, prayerTimes]);
}
