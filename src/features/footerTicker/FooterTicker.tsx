// src/features/footerTicker/FooterTicker.tsx
import { useMemo, useState, useEffect, useRef } from "react";
import { useCity } from "../../app/CityProvider";

import AllahImg from "../../assets/ressources/ALLAH-image.png";
import MuhammadImg from "../../assets/ressources/Muhammad-image.png";
import DuaImg from "../../assets/ressources/dua-image.png";

// wir mappen imageKey -> tatsächliches Bild
function getImageForKey(key: string | undefined) {
    switch (key) {
        case "allah":
            return AllahImg;
        case "muhammad":
            return MuhammadImg;
        case "dua":
            return DuaImg;
        default:
            return null;
    }
}

export function FooterTicker() {
    const { dailyContent } = useCity();

    // Rotationsindex
    const [index, setIndex] = useState(0);

    // Alle 20 Sekunden zum nächsten Item springen
    useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => {
                if (!dailyContent?.items || dailyContent.items.length === 0) return 0;
                return (prev + 1) % dailyContent.items.length;
            });
        }, 20000); // 20s

        return () => clearInterval(id);
    }, [dailyContent]);

    // Welches Item ist aktiv?
    const activeItem = useMemo(() => {
        if (!dailyContent || !dailyContent.items || dailyContent.items.length === 0) {
            return null;
        }
        const safeIndex = index % dailyContent.items.length;
        return dailyContent.items[safeIndex];
    }, [dailyContent, index]);

    // Für Auto-Scroll (Ticker-Effekt) brauchen wir refs,
    // um zu checken, ob Text breiter ist als sichtbarer Bereich.
    const containerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    // Wir steuern via inline-style transform, statt per fixed CSS-Animation,
    // damit es nur scrollt, wenn nötig.
    const [scrollNeeded, setScrollNeeded] = useState(false);
    const [scrollX, setScrollX] = useState(0);

    // Wenn aktiver Text länger als Container ist -> animiert schieben
    useEffect(() => {
        function checkWidth() {
            const c = containerRef.current;
            const d = contentRef.current;
            if (!c || !d) return;

            // Wenn Content breiter als Container -> wir scrollen
            const needsScroll = d.scrollWidth > c.clientWidth;
            setScrollNeeded(needsScroll);
            setScrollX(0);
        }

        checkWidth();
        window.addEventListener("resize", checkWidth);
        return () => window.removeEventListener("resize", checkWidth);
    }, [activeItem]);

    // Smooth scroll logic
    useEffect(() => {
        if (!scrollNeeded) return;

        let frame: number;
        let x = 0;

        const step = () => {
            x -= 0.5; // Geschwindigkeit
            setScrollX(x);
            frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [scrollNeeded, activeItem]);

    // Render
    return (
        <footer className="w-full bg-neutral-900 border-t border-neutral-700 py-6 px-12 flex items-center overflow-hidden">
            {!activeItem ? (
                <div className="text-neutral-500 text-3xl font-light">
                    Lade islamische Inhalte…
                </div>
            ) : (
                <div className="flex items-center w-full gap-8 text-white">
                    {/* Bild/Icon-Badge links */}
                    <div className="flex-shrink-0 flex items-center justify-center">
                        {(() => {
                            const img = getImageForKey(activeItem.imageKey);
                            if (img) {
                                return (
                                    <img
                                        src={img}
                                        alt={activeItem.title}
                                        className="w-24 h-24 object-contain drop-shadow-[0_0_20px_rgba(0,153,114,0.5)]"
                                    />
                                );
                            }
                            // fallback: nur Text
                            return (
                                <div className="text-4xl font-bold text-[#009972]">
                                    {activeItem.title}
                                </div>
                            );
                        })()}
                    </div>

                    {/* Scroll-Container */}
                    <div
                        ref={containerRef}
                        className="relative flex-1 overflow-hidden"
                        style={{
                            // dafür sorgen, dass Text nicht umbrechen darf
                            whiteSpace: "nowrap",
                        }}
                    >
                        <div
                            ref={contentRef}
                            className="text-4xl leading-snug font-light text-neutral-200"
                            style={{
                                transform: scrollNeeded
                                    ? `translateX(${scrollX}px)`
                                    : "translateX(0)",
                                willChange: "transform",
                            }}
                        >
                            {/* Titel */}
                            <span className="text-white font-semibold mr-8">
                {activeItem.title}:
              </span>

                            {/* Haupttext */}
                            <span>{activeItem.text}</span>

                            {/* Quelle */}
                            {activeItem.source ? (
                                <span className="text-neutral-400 ml-12 text-3xl">
                  {activeItem.source}
                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </footer>
    );
}
