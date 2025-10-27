// src/features/footerTicker/FooterTicker.tsx
import { useMemo, useState, useEffect, useRef } from "react";
import { useCity } from "../../app/CityProvider";

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

    // Alle 20s weiterschalten
    useEffect(() => {
        const id = setInterval(() => {
            setIndex((prev) => {
                if (!dailyContent?.items || dailyContent.items.length === 0) return 0;
                return (prev + 1) % dailyContent.items.length;
            });
        }, 20000);
        return () => clearInterval(id);
    }, [dailyContent]);

    const activeItem = useMemo(() => {
        if (!dailyContent?.items || dailyContent.items.length === 0) return null;
        const safeIndex = index % dailyContent.items.length;
        return dailyContent.items[safeIndex];
    }, [dailyContent, index]);

    // Auto-Scroll Setup
    const containerRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [scrollNeeded, setScrollNeeded] = useState(false);
    const [scrollX, setScrollX] = useState(0);

    // Check Overflow
    useEffect(() => {
        function checkWidth() {
            const c = containerRef.current;
            const d = contentRef.current;
            if (!c || !d) return;
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
            x -= 0.5;
            setScrollX(x);
            frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [scrollNeeded, activeItem]);

    // RENDER
    return (
        <footer
            className="
                w-full
                flex
                items-center
                justify-start
                text-white
                rounded-4xl
                mx-auto
                h-[450px]
            "
            style={{
                backgroundColor: "#343434", // wie alter Footer
                minHeight: "12rem", // Höhe ähnlich h-footer / h-400
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
            }}
        >
            {!activeItem ? (
                <div className="text-white text-5xl font-light pl-8">
                    Lade islamische Inhalte…
                </div>
            ) : (
                <>
                    {/* LINKER BLOCK: Bild */}
                    <div
                        className="flex-shrink-0 flex items-center justify-center"
                        style={{
                            marginLeft: "0.5rem",
                            marginRight: "2rem",
                            height: "20rem", // alte h-400
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
                                            filter:
                                                "drop-shadow(0 0 20px rgba(0,153,114,0.5))",
                                        }}
                                    />
                                );
                            }
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

                    {/* RECHTER BLOCK: Lauftext */}
                    <div
                        className="flex-grow flex items-center overflow-hidden"
                        ref={containerRef}
                        style={{
                            height: "10rem",
                            whiteSpace: "nowrap",
                        }}
                    >
                        <div
                            ref={contentRef}
                            style={{
                                transform: scrollNeeded
                                    ? `translateX(${scrollX}px)`
                                    : "translateX(0)",
                                willChange: "transform",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <p
                                className="text-white font-light"
                                style={{
                                    fontSize: "4rem", // text-footer Größe
                                    lineHeight: 1.2,
                                }}
                            >
                                <span
                                    className="font-semibold text-white"
                                    style={{ marginRight: "2rem" }}
                                >
                                    {activeItem.title}:
                                </span>
                                <span>{activeItem.text}</span>
                                {activeItem.source ? (
                                    <span
                                        style={{
                                            marginLeft: "2rem",
                                            color: "rgba(255,255,255,0.6)",
                                            fontSize: "3rem",
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        {activeItem.source}
                                    </span>
                                ) : null}
                            </p>
                        </div>
                    </div>
                </>
            )}
        </footer>
    );
}
