import { useEffect, useRef } from "react";

const isVisible = (el) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect?.();
    if (!rect) return true;
    return rect.width > 0 && rect.height > 0;
};

const scrollToEl = (el) => {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const focusTarget = el.matches?.("input,select,textarea")
        ? el
        : el.querySelector?.(
              "input,select,textarea,button,[tabindex]:not([tabindex='-1'])"
          );
    focusTarget?.focus?.({ preventScroll: true });
};

const findFieldForKey = (key) => {
    if (!key || typeof document === "undefined") return null;

    return (
        document.querySelector(`[name="${key}"]`) ||
        document.querySelector(`[data-field="${key}"]`) ||
        document.getElementById(`field-${key}`) ||
        document.getElementById(key)
    );
};

const findFirstRenderedError = () => {
    if (typeof document === "undefined") return null;

    const errorEls = Array.from(document.querySelectorAll(".text-danger"));
    const first = errorEls.find((el) => {
        const text = (el.textContent || "").trim();
        return text.length > 0 && isVisible(el);
    });

    if (!first) return null;

    return (
        first.closest(".form-group") ||
        first.closest(".mb-3") ||
        first.closest(".input-group") ||
        first
    );
};

const normalizeErrors = (errors) => {
    if (!errors || typeof errors !== "object" || Array.isArray(errors)) {
        return {};
    }

    const normalized = {};
    Object.keys(errors).forEach((k) => {
        const v = errors[k];
        if (v === null || typeof v === "undefined") return;
        if (typeof v === "string" && v.trim() === "") return;
        normalized[k] = v;
    });

    return normalized;
};

const useScrollToFirstError = (errors) => {
    const prevCount = useRef(0);

    useEffect(() => {
        const errs = normalizeErrors(errors);
        const keys = Object.keys(errs);

        if (!keys.length) {
            prevCount.current = 0;
            return;
        }

        // Only auto-scroll when errors appear (avoid fighting user while typing)
        if (prevCount.current > 0) {
            prevCount.current = keys.length;
            return;
        }

        prevCount.current = keys.length;

        for (const key of keys) {
            const field = findFieldForKey(key);
            if (field) {
                scrollToEl(field);
                return;
            }
        }

        scrollToEl(findFirstRenderedError());
    }, [errors]);
};

export default useScrollToFirstError;
