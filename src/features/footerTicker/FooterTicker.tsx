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
        <div
            className={`
                glass-card glass-card-content glass-animate-in
                w-full
                flex
                items-center
                justify-start
                text-white
                mx-auto
                rounded-3xl
                px-6
                py-4
                gap-6
            `}
            style={{
                boxShadow:
                    "0 30px 80px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.8), 0 0 60px rgba(0,150,255,0.3)",
            }}
        >
            {!activeItem ? (
                <div
                    className="text-white font-light flex items-center"
                    style={{
                        fontSize: "2rem",
                        lineHeight: 1.2,
                        paddingLeft: "1rem",
                    }}
                >
                    Lade islamische Inhalte…
                </div>
            ) : (
                <>
                    {/* LINKER BLOCK: Bild / Icon */}
                    <div
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{
                            width: "6rem",
                            height: "6rem",
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
                                        }}
                                    />
                                );
                            }
                            // fallback falls kein bild-key
                            return (
                                <div
                                    className="text-[#009972] font-bold text-center"
                                    style={{
                                        fontSize: "2rem",
                                        lineHeight: 1.1,
                                    }}
                                >
                                    {activeItem.title}
                                </div>
                            );
                        })()}
                    </div>

                    {/* RECHTER BLOCK: Textbereich mit Auto-Scroll */}
                    <div
                        ref={containerRef}
                        className="flex-grow overflow-hidden flex items-center"
                        style={{
                            maxHeight: "8rem", // begrenze Sichtfenster
                        }}
                    >
                        <div
                            ref={contentRef}
                            className="flex flex-col w-full text-white"
                            style={{
                                rowGap: "1rem",
                                maxWidth: "100%",
                            }}
                        >
                            {/* Haupttext */}
                            <div
                                className="text-white text-center"
                                style={{
                                    fontSize: "2rem",
                                    lineHeight: 1.3,
                                    wordBreak: "break-word",
                                }}
                            >
                                {activeItem.text}
                            </div>

                            {/* Quelle */}
                            {activeItem.source ? (
                                <div
                                    className="text-white self-end text-right"
                                    style={{
                                        fontSize: "1.5rem",
                                        lineHeight: 1.3,
                                    }}
                                >
                                    {activeItem.source}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
