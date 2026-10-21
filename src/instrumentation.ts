export async function register() {
    if (process.env.NEXT_RUNTIME !== 'nodejs') return;

    const { loadConfigIntoEnv, isConfigured, getMissingKeys, CONFIG_PATH } = await import(
        '@/lib/config'
    );

    loadConfigIntoEnv();

    if (!isConfigured()) {
        console.warn(
            `[sarge] Missing required config: ${getMissingKeys().join(', ')}. ` +
                `Set them in .env or in ${CONFIG_PATH}.`
        );
    }
}