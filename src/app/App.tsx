// src/app/App.tsx
import { useCity } from "./CityProvider";
import { PrayerPanel } from "../features/prayer/PrayerPanel";
import { FooterTicker } from "../features/footerTicker/FooterTicker";
import { TopHeader } from "../features/header/TopHeader";

export default function App() {
    const { isValidCity, cityKey, loading, error } = useCity();

    // Error-/Loading-States skalieren wir ebenfalls runter,
    // damit die States nicht plötzlich riesig wirken.
    if (!isValidCity)
        return (
            <div className="w-full min-h-screen flex items-center justify-center text-red-500 font-bold">
                <div className="origin-center text-6xl text-center">
                    Unbekannte Stadt: {cityKey}
                </div>
            </div>
        );

    if (loading)
        return (
            <div className="w-full min-h-screen flex items-center justify-center text-yellow-400 font-bold">
                <div className=" origin-center text-6xl text-center">
                    Lädt…
                </div>
            </div>
        );

    if (error)
        return (
            <div className="w-full min-h-screen flex items-center justify-center text-red-500 font-bold">
                <div className="origin-center text-6xl text-center px-4">
                    Fehler beim Laden:
                    <br />
                    {error}
                </div>
            </div>
        );

    return (
        <div className="relative flex flex-col w-full min-h-screen text-white bg-transparent overflow-hidden">

            {/* HEADER OBEN */}
            <header className="w-full flex justify-between items-start px-4 py-4">
                <div className="origin-top-left w-full">
                    <TopHeader />
                </div>
            </header>

            {/* MAIN CONTENT ZENTRIERT */}
            <main className="flex-1 flex items-center justify-center px-4 pb-[120px]">
                {/* pb-[120px] = Reserve nach unten, damit der Footer (fixed) nicht überlappt */}
                <div className="origin-center">
                    <PrayerPanel />
                </div>
            </main>

            {/* FOOTER FIX UNTEN */}
            <footer className="fixed bottom-0 left-0 w-full px-4 py-4">
                <div className="origin-bottom-left w-full">
                    <FooterTicker />
                </div>
            </footer>
        </div>
    );
}
