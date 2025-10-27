// src/app/App.tsx
import { AppShell } from "./AppShell";
import { useCity } from "./CityProvider";

export default function App() {
    const { config, isValidCity, cityKey } = useCity();

    return (
        <AppShell>
            {!isValidCity ? (
                // Ungültige Stadt in URL
                <div className="w-full h-full flex items-center justify-center bg-black text-red-500 text-6xl font-bold">
                    Unbekannte Stadt: {cityKey}
                </div>
            ) : (
                <div className="flex flex-col w-full h-full text-white">
                    {/* HEADER */}
                    <header className="w-full border-b border-neutral-700 p-8 flex items-center justify-between">
                        <div className="text-5xl font-bold leading-snug">
                            {config?.mosqueName}
                        </div>
                        <div className="text-2xl text-neutral-400 text-right">
                            Wetter-Ort: {config?.weatherCityName}
                            <br />
                            API: {config?.prayerApiUrl}
                        </div>
                    </header>

                    {/* MITTE */}
                    <main className="flex-1 flex items-center justify-center text-6xl font-bold">
                        Hier kommen Gebetszeiten, Countdown usw.
                    </main>

                    {/* FOOTER */}
                    <footer className="w-full bg-neutral-900 border-t border-neutral-700 p-8 text-3xl text-neutral-300">
                        Footer (Hadith / Dua / Laufband)
                    </footer>
                </div>
            )}
        </AppShell>
    );
}
