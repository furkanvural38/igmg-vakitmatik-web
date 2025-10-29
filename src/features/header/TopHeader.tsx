import { useCity } from "../../app/CityProvider";
import IGMGLogo from "../../assets/ressources/igmg-logo.png";

export function TopHeader() {
    const { config } = useCity();

    return (
        <header
            className="
                w-full
                flex
                items-center
                justify-between
                px-4
                py-3
                gap-4
            "
            style={{
                margin: 0,
            }}
        >
            {/* LOGO-BOX (kompakt) */}
            <div
                className="
                    relative
                    flex
                    items-center
                    justify-center
                    rounded-xl
                    glass-text
                    px-4
                    py-2
                "
                style={{
                    flex: "0 0 220px",     // feste Breite: kompakt
                    height: "64px",        // Header-Scale niedrig
                    borderRadius: "0.75rem",
                }}
            >
                {/* optionaler Glow-Ring */}
                <div
                    style={{
                        borderRadius: "0.75rem",
                        position: "absolute",
                        inset: "-4px",
                        opacity: 0.5,
                        zIndex: 1,
                        pointerEvents: "none",
                    }}
                />

                {/* Logo selbst */}
                <div
                    className="relative z-[2] flex items-center justify-center"
                    style={{
                        filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.8))",
                    }}
                >
                    <img
                        src={IGMGLogo}
                        alt="IGMG"
                        className="h-[48px] object-contain"
                    />
                </div>
            </div>

            {/* MOSCHEE-NAME (kompakt) */}
            <div
                className="
                    relative
                    flex
                    items-center
                    justify-center
                    flex-1
                    rounded-xl
                    glass-text
                    text-center
                    uppercase
                    leading-snug
                    px-6
                    py-2
                    min-w-0
                "
                style={{
                    height: "64px",
                    borderRadius: "0.75rem",
                    fontSize: "2rem",           // ~32px statt 5.5rem
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    color: "white",
                    textShadow:
                        "0 2px 4px rgba(0,0,0,0.8), 0 0 10px rgba(0,0,0,0.8)",
                }}
            >
                {/* Glow-Ring */}
                <div
                    style={{
                        borderRadius: "0.75rem",
                        position: "absolute",
                        inset: "-4px",
                        opacity: 0.5,
                        zIndex: 1,
                        pointerEvents: "none",
                    }}
                />

                {/* Text */}
                <div
                    className="relative z-[2] text-white font-bold tracking-[.08em] truncate"
                    style={{
                        lineHeight: "1.1",
                        width: "100%",
                        filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.8))",
                        fontSize: "2rem", // redundant, aber explizit
                    }}
                    title={config?.mosqueName ?? "—"}
                >
                    {config?.mosqueName ?? "—"}
                </div>
            </div>
        </header>
    );
}
