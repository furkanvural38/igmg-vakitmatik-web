import { AppShell } from "./AppShell";

export default function App() {
    return (
        <AppShell>
            <div className="flex flex-col w-full h-full">
                {/* HEADER-BEREICH */}
                <header className="w-full">
                    {/* Hier kommt später dein Header mit Logo + Moschee-Name */}
                    <div className="text-white text-5xl font-bold p-8">
                        Header (kommt später rein)
                    </div>
                </header>

                {/* MITTLERER BEREICH */}
                <main className="flex-1 flex flex-row">
                    {/* Linke / zentrale große Gebetszeit- und Countdown-Fläche */}
                    <section className="flex-1 flex items-center justify-center text-white text-8xl">
                        Gebetszeiten / Countdown / Datum / Wetter
                    </section>
                </main>

                {/* FOOTER-BEREICH */}
                <footer className="w-full">
                    {/* Laufband / FooterTicker */}
                    <div className="text-white text-2xl p-4 bg-[#111]">
                        Footer Ticker / Dua / Hadith
                    </div>
                </footer>
            </div>
        </AppShell>
    );
}