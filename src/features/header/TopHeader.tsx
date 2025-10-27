
import { useCity } from "../../app/CityProvider";
import IGMGLogo from "../../assets/ressources/igmg-logo.png";

const BORDER = "1px solid #ffffff80";

export function TopHeader() {
    const { config } = useCity();

    return (
        <div className="flex w-full max-w-[3200px] justify-between items-start mb-12">
            {/* Logo box */}
            <div
                className="flex items-center justify-center rounded-md px-8 py-6"
                style={{
                    border: BORDER,
                    minWidth: "300px",
                    minHeight: "90px",
                }}
            >
                <img
                    src={IGMGLogo}
                    alt="IGMG"
                    className="h-[60px] object-contain"
                />
            </div>

            {/* Moschee-Name box */}
            <div
                className="flex items-center justify-center rounded-md px-12 py-6 text-white text-5xl font-bold tracking-[.08em] uppercase text-center leading-snug"
                style={{
                    border: BORDER,
                    minHeight: "90px",
                    flexGrow: 1,
                    marginLeft: "24px",
                }}
            >
                {config?.mosqueName ?? "—"}
            </div>
        </div>
    );
}
