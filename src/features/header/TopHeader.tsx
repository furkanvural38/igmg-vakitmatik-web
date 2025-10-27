import { useCity } from "../../app/CityProvider";
import IGMGLogo from "../../assets/ressources/igmg-logo.png";

const BORDER = "8px solid #ffffff80";

export function TopHeader() {
    const { config } = useCity();

    return (
        <div
            className="
                flex
                w-full
                items-center
                justify-between
                m-6
                gap-6   /* 🔹 Abstand zwischen Logo und Name */
            "
        >
            {/* 🔸 Logo box */}
            <div
                className="
                    flex
                    items-center
                    justify-center
                    rounded-2xl
                    px-10
                    py-6
                "
                style={{
                    border: BORDER,
                    borderRadius: 24,
                    flex: "0 0 550px", // 🔹 feste Breite, aber gleiche Höhe
                    height: "200px",   // 🔹 Höhe für beide Boxen gleich
                }}
            >
                <img
                    src={IGMGLogo}
                    alt="IGMG"
                    className="h-[130px] object-contain"
                />
            </div>

            {/* 🔸 Moschee-Name box */}
            <div
                className="
                    flex
                    items-center
                    justify-center
                    rounded-2xl
                    px-12
                    py-6
                    text-white
                    font-bold
                    tracking-[.08em]
                    uppercase
                    text-center
                    leading-snug
                    flex-1
                "
                style={{
                    border: BORDER,
                    borderRadius: 24,
                    height: "200px",  // 🔹 exakt gleiche Höhe wie Logo
                    fontSize: "7rem",
                }}
            >
                {config?.mosqueName ?? "—"}
            </div>
        </div>
    );
}
