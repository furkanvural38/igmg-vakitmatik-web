// src/features/footerTicker/FooterTicker.tsx
import { useMemo, useState, useEffect, useRef } from "react";
import { useCity } from "../../app/CityProvider";
import { useVerticalScroll } from "../../hooks/useVerticalScroll";

import AllahImg from "../../assets/ressources/ALLAH-image.png";
import MuhammadImg from "../../assets/ressources/Muhammad-image.png";
import DuaImg from "../../assets/ressources/dua-image.png";

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
    const [index, setIndex] = useState(0);

    // alle 20 sekunden zum nächsten item
    useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => {
                if (!dailyContent?.items || dailyContent.items.length === 0) return 0;
                return (prev + 1) % dailyContent.items.length;
            });
        }, 20000);

        return () => clearInterval(id);
    }, [dailyContent]);

    // aktives item auswählen
    const activeItem = useMemo(() => {
        if (!dailyContent?.items || dailyContent.items.length === 0) return null;
        const safeIndex = index % dailyContent.items.length;
        return dailyContent.items[safeIndex];
    }, [dailyContent, index]);

    // refs für auto-scroll nach unten
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // hook aktivieren (scrollt vertikal von oben nach unten + loop)
    useVerticalScroll(containerRef, contentRef);

    return (
        <footer
            className="
                w-full
                flex
                items-center
                justify-start
                text-white
                mx-auto
                rounded-3xl
                h-[450px]
                px-8
            "
            style={{
                backgroundColor: "#343434",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
        >
            {!activeItem ? (
                <div
                    className="text-white font-light flex items-center"
                    style={{
                        fontSize: "4rem",
                        lineHeight: 1.2,
                        paddingLeft: "2rem",
                    }}
                >
                    Lade islamische Inhalte…
                </div>
            ) : (
                <>
                    {/* LINKER BLOCK: großes Bild */}
                    <div
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{
                            marginLeft: "0.5rem",
                            marginRight: "2rem",
                            height: "20rem", // groß wie gewünscht
                            width: "20rem",
                        }}
                    >
                        {(() => {
                            const img = getImageForKey(activeItem.imageKey);
                            if (img) {
                                return (
                                    <img
                                        src={img}
                                        alt={activeItem.title}
                                        style={{
                                            height: "100%",
                                            width: "100%",
                                            objectFit: "contain",
                                            filter: "drop-shadow(0 0 20px rgba(0,153,114,0.5))",
                                        }}
                                    />
                                );
                            }
                            // fallback falls kein bild-key
                            return (
                                <div
                                    className="text-[#009972] font-bold text-center"
                                    style={{
                                        fontSize: "4rem",
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {activeItem.title}
                                </div>
                            );
                        })()}
                    </div>

                    {/* RECHTER BLOCK: vertikaler scroll-bereich */}
                    <div
                        ref={containerRef}
                        className="
                            flex-grow
                            overflow-hidden
                            flex
                            justify-start
                            items-start
                        "
                        style={{
                            // sichtfenster für den scroll
                            height: "20rem",
                        }}
                    >
                        <div
                            ref={contentRef}
                            className="
                                flex
                                flex-col
                                justify-start
                                items-start
                                text-white
                            "
                            style={{
                                rowGap: "2rem", // abstand zwischen zeilen/blöcken
                            }}
                        >
                            {/* Haupttext */}
                            <div
                                className="font-light text-white ml-8"
                                style={{
                                    fontSize: "5rem",
                                    lineHeight: 1.2,
                                }}
                            >
                                {activeItem.text}
                            </div>

                            {/* Quelle / Hadith-Quelle o.ä. */}
                            {activeItem.source ? (
                                <div
                                    className="text-white ml-8"
                                    style={{
                                        fontSize: "4rem",
                                        lineHeight: 1.2,
                                        color: "rgba(255,255,255,0.6)",
                                    }}
                                >
                                    {activeItem.source}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </>
            )}
        </footer>
    );
}
