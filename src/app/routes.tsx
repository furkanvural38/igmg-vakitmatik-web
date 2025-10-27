// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import { CityProvider } from "./CityProvider";
import App from "./App";

function CityAppWrapper() {
    // CityProvider holt cityKey aus URL-Parametern.
    return (
        <CityProvider>
            <App />
        </CityProvider>
    );
}

export const router = createBrowserRouter([
    {
        path: "/:cityKey",
        element: <CityAppWrapper />,
    },
    {
        path: "/",
        element: (
            <div style={{ color: "white", backgroundColor: "black", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", flexDirection: "column", textAlign: "center" }}>
                <div>Bitte Stadt-URL aufrufen, z.B.</div>
                <div className="font-mono mt-4 text-green-400">/hannover</div>
                <div className="font-mono text-green-400">/braunschweig</div>
            </div>
        ),
    },
]);
