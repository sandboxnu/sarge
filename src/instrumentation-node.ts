import { CONFIG_PATH, getMissingKeys, isConfigured, loadConfigIntoEnv } from '@/lib/config';

loadConfigIntoEnv();

if (!isConfigured()) {
    console.warn(
        `[sarge] Missing required config: ${getMissingKeys().join(', ')}. ` +
            `Set them in .env or in ${CONFIG_PATH}.`
    );
}
