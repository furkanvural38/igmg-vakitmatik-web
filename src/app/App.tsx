// src/app/App.tsx
import { AppShell } from "./AppShell";
import { useCity } from "./CityProvider";
import { PrayerPanel } from "../features/prayer/PrayerPanel";
import { FooterTicker } from "../features/footerTicker/FooterTicker";
import { TopHeader } from "../features/header/TopHeader";




export default function App() {
    const {
        config,
        isValidCity,
        cityKey,
        loading,
        error,
        clock,
        prayerTimes,
        weather,
    } = useCity();

    const timeString = clock.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return (
        <AppShell>
            {!isValidCity ? (
                <div className="w-full h-full flex items-center justify-center bg-black text-red-500 text-6xl font-bold">
                    Unbekannte Stadt: {cityKey}
                </div>
            ) : loading ? (
                <div className="w-full h-full flex items-center justify-center bg-black text-yellow-400 text-6xl font-bold">
                    Lädt…
                </div>
            ) : error ? (
                <div className="w-full h-full flex items-center justify-center bg-black text-red-500 text-6xl font-bold text-center px-20">
                    Fehler beim Laden:
                    <br />
                    {error}
                </div>
            ) : (
                <div className="flex flex-col w-full h-full text-white bg-black">
                    {/* HEADER */}
                    <header className="w-full border-b border-neutral-700 p-8 flex items-start justify-between">
                        <TopHeader />
                    </header>


                    {/* MITTLERER BEREICH */}
                    <main className="flex-1 flex flex-col items-center justify-center gap-16 text-white">
                        <PrayerPanel />
                    </main>

                    {/* FOOTER */}
                    <footer >
                        <FooterTicker />
                    </footer>
                </div>
            )}
        </AppShell>
    );
}
