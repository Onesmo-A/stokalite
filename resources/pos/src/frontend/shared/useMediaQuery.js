import { useEffect, useState } from "react";

const useMediaQuery = (query) => {
    const getMatch = () => {
        if (typeof window === "undefined" || !window.matchMedia) return false;
        return window.matchMedia(query).matches;
    };

    const [matches, setMatches] = useState(getMatch);

    useEffect(() => {
        if (typeof window === "undefined" || !window.matchMedia) return;

        const mediaQueryList = window.matchMedia(query);
        const onChange = () => setMatches(mediaQueryList.matches);

        onChange();

        if (mediaQueryList.addEventListener) {
            mediaQueryList.addEventListener("change", onChange);
            return () => mediaQueryList.removeEventListener("change", onChange);
        }

        mediaQueryList.addListener(onChange);
        return () => mediaQueryList.removeListener(onChange);
    }, [query]);

    return matches;
};

export default useMediaQuery;
