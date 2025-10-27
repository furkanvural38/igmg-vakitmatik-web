// src/app/App.tsx
import { AppShell } from "./AppShell";
import { useCity } from "./CityProvider";
import { PrayerPanel } from "../features/prayer/PrayerPanel";
import { FooterTicker } from "../features/footerTicker/FooterTicker";



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
                        {/* Linker Teil: Moschee-Name */}
                        <div className="flex flex-col max-w-[70%]">
                            <div className="text-5xl font-bold leading-snug text-white">
                                {config?.mosqueName}
                            </div>
                            <div className="text-xl text-neutral-400 mt-4">
                                Stadt: <span className="text-white font-semibold">{config?.weatherCityName}</span>
                                <br />
                                Stand:{" "}
                                <span className="text-neutral-300 font-mono">
        {clock.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })}
      </span>
                            </div>
                        </div>

                        {/* Rechter Teil: Wetter-Box */}
                        <div className="flex flex-col items-end text-right">
                            {weather ? (
                                <>
                                    <div className="flex items-center gap-4">
                                        {/* Wetter Icon */}
                                        {weather.weather && weather.weather[0] ? (
                                            <img
                                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                                alt={weather.weather[0].description}
                                                className="w-20 h-20 object-contain"
                                            />
                                        ) : null}

                                        <div className="text-white text-5xl font-semibold leading-none">
                                            {Math.round(weather.main.temp)}°C
                                        </div>
                                    </div>

                                    <div className="text-neutral-400 text-2xl leading-snug mt-2">
                                        {weather.weather && weather.weather[0]
                                            ? weather.weather[0].description
                                            : "—"}
                                        <br />
                                        Luftfeuchte:{" "}
                                        <span className="text-white font-semibold">
            {weather.main.humidity}%
          </span>
                                    </div>
                                </>
                            ) : (
                                <div className="text-neutral-600 text-2xl">
                                    Wetter nicht verfügbar
                                </div>
                            )}
                        </div>
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
