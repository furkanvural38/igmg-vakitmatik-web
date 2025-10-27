// src/app/AppShell.tsx
import React from "react";
import { useScaleToScreen } from "../hooks/useScaleToScreen";

type AppShellProps = {
    children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
    const { baseWidth, baseHeight, scale, offsetX, offsetY } = useScaleToScreen();

    return (
        <div
            className="
        bg-black
        text-white
        fixed
        inset-0
        overflow-hidden
      "
            style={{
                // Hintergrund fullscreen schwarz, wie deine aktuelle App
            }}
        >
            <div
                style={{
                    position: "absolute",
                    width: baseWidth,
                    height: baseHeight,
                    left: `${offsetX}px`,
                    top: `${offsetY}px`,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    // Wichtig: kein overflow, damit nichts verrutscht
                    backgroundColor: "#000000",
                    color: "#ffffff",
                }}
                className="select-none"
            >
                {/* Hier kommt dein eigentlicher Bildschirm-Inhalt rein */}
                {children}
            </div>
        </div>
    );
}
