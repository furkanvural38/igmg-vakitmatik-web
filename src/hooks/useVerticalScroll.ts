import { useEffect, type RefObject } from "react";

export const useVerticalScroll = (
    scrollContainerRef: RefObject<HTMLDivElement>,
    contentRef: RefObject<HTMLDivElement>
) => {
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        const content = contentRef.current;

        if (!scrollContainer || !content) return;

        let scrollAmount = 0;
        let scrollInterval: number | null = null;
        let pauseTimeout: number | null = null;

        const shouldScroll = () => {
            // nur scrollen, wenn der Inhalt deutlich höher ist als das Sichtfenster
            return content.scrollHeight > scrollContainer.clientHeight * 1.1;
        };

        const clearTimers = () => {
            if (scrollInterval !== null) {
                clearInterval(scrollInterval);
                scrollInterval = null;
            }
            if (pauseTimeout !== null) {
                clearTimeout(pauseTimeout);
                pauseTimeout = null;
            }
        };

        const startScrolling = () => {
            // Reset nach oben
            scrollAmount = 0;
            scrollContainer.scrollTop = 0;

            // Safety: falls vorher noch Timer laufen → killen
            clearTimers();

            // Autoscroll Loop
            scrollInterval = window.setInterval(() => {
                scrollAmount += 1; // Schrittweite (px pro Tick)
                scrollContainer.scrollTop = scrollAmount;

                const maxScroll =
                    content.scrollHeight - scrollContainer.clientHeight;

                // Ende erreicht?
                if (scrollAmount >= maxScroll) {
                    clearTimers();

                    // kurze Pause unten, dann zurückspringen
                    pauseTimeout = window.setTimeout(() => {
                        scrollAmount = 0;
                        scrollContainer.scrollTop = 0;
                        startScrolling(); // restart
                    }, 1000); // 1 Sekunde warten am Ende
                }
            }, 30); // Intervall-Geschwindigkeit (ms zwischen jedem Pixel)
        };

        // Initial starten falls nötig
        if (shouldScroll()) {
            startScrolling();
        }

        // Auf Größen / Text-Änderungen reagieren
        const resizeObserver = new ResizeObserver(() => {
            // Reset + neu entscheiden
            clearTimers();
            scrollAmount = 0;
            scrollContainer.scrollTop = 0;

            if (shouldScroll()) {
                startScrolling();
            }
        });

        resizeObserver.observe(content);

        return () => {
            clearTimers();
            resizeObserver.disconnect();
        };
    }, [scrollContainerRef, contentRef]);
};
