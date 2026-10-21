import fs from 'node:fs';
import path from 'node:path';

export const CONFIG_PATH =
    process.env.SARGE_CONFIG_PATH ?? path.join(process.cwd(), 'data', 'sarge.config.json');

// names match the existing env variables so nothing that reads process.env has to change
export const CONFIG_KEYS = [
    'DATABASE_URL',
    'DIRECT_URL',
    'BETTER_AUTH_URL',
    'BETTER_AUTH_SECRET',
    'REQUIRE_EMAIL_VERIFICATION',
    'JWT_SECRET',
    'INTERNAL_API_SECRET',
    'EMAIL_DOMAIN',
    'JUDGE_URL',
    'JUDGE_API_KEY',
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_BUCKET_NAME',
    'AWS_SECRET_NAME',
] as const;

export type ConfigKey = (typeof CONFIG_KEYS)[number];
export type ConfigValues = Partial<Record<ConfigKey, string>>;

const REQUIRED_KEYS: ConfigKey[] = ['DATABASE_URL', 'BETTER_AUTH_SECRET', 'JWT_SECRET'];

export function readConfigFile(): ConfigValues {
    try {
        return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    } catch {
        return {};
    }
}

// called once at boot from instrumentation.ts. .env takes precedent over the file
export function loadConfigIntoEnv(): void {
    process.env.SARGE_ENV_PROVIDED_KEYS = CONFIG_KEYS.filter((key) => process.env[key]).join(',');
    const file = readConfigFile();
    for (const key of CONFIG_KEYS) {
        const value = file[key];
        if (value && !process.env[key]) process.env[key] = value;
    }
}

export function isEnvProvided(key: ConfigKey): boolean {
    return (process.env.SARGE_ENV_PROVIDED_KEYS ?? '').split(',').includes(key);
}

export function getMissingKeys(): ConfigKey[] {
    return REQUIRED_KEYS.filter((key) => !process.env[key]);
}

export function isConfigured(): boolean {
    return getMissingKeys().length === 0;
}