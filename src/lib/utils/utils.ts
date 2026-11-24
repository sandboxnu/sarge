export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Open-redirect guard: URL parsing catches tricks like "/\t/evil.com" that prefix checks miss
export const safeRedirect = (
    param: string | null,
    origin: string,
    fallback = '/crm/dashboard'
): string => {
    if (!param) return fallback;
    try {
        const url = new URL(param, origin);
        return url.origin === origin ? url.pathname + url.search + url.hash : fallback;
    } catch {
        return fallback;
    }
};

// Read from window so pages don't need a Suspense boundary for useSearchParams
export const getRedirectParam = (): string =>
    safeRedirect(
        new URLSearchParams(window.location.search).get('redirect'),
        window.location.origin
    );
