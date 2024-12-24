import { useEffect, useState } from 'react';

function isMobileDevice(): boolean {
    // 1. User-Agent detection
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isMobileUA = /android|ipad|iphone|ipod|windows phone|iemobile|wpdesktop|kindle|silk|mobile|crios/i.test(userAgent);

    // 2. Pointer detection
    // "coarse" generally indicates a touchscreen-based (mobile or tablet) device
    const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;

    // 3. Screen width check (for small screens)
    const isSmallScreen = window.innerWidth < 1024;

    // Return true if any of these checks indicate a “mobile” form factor
    return isMobileUA || isCoarsePointer || isSmallScreen;
}

export function useIsMobile(): boolean {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // Define a function that re-checks on resize, orientation change, etc.
        function checkDevice() {
            setIsMobile(isMobileDevice());
        }

        // Run once on mount
        checkDevice();

        // Re-run whenever the window is resized or orientation changes
        window.addEventListener('resize', checkDevice);
        window.addEventListener('orientationchange', checkDevice);

        return () => {
            window.removeEventListener('resize', checkDevice);
            window.removeEventListener('orientationchange', checkDevice);
        };
    }, []);

    return isMobile;
}
