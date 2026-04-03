export const environment = {
    // Base URL for this SPA + Laravel backend.
    // - Includes port (e.g. http://localhost:8000)
    // - Includes subfolder if the app is hosted under one (e.g. http://localhost/stokalite)
    URL: (() => {
        const basePath = window.location.pathname
            .replace(/\/index\.php$/, "")
            .replace(/\/$/, "");

        return window.location.origin + basePath;
    })(),
};
