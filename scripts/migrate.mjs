import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const mode = process.argv[2] === 'dev' ? 'dev' : 'deploy';
const configPath =
    process.env.SARGE_CONFIG_PATH ?? path.join(process.cwd(), 'data', 'sarge.config.json');

let file = {};
try {
    file = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch {
    // no config file yet
}

const databaseUrl = process.env.DATABASE_URL || file.DATABASE_URL;
if (!databaseUrl) {
    console.log('[sarge] No database configured, skipping migrations.');
    process.exit(0);
}

// `prisma` is on PATH via package scripts in dev and installed globally in the production image
execFileSync('prisma', ['migrate', mode], {
    stdio: 'inherit',
    env: {
        ...process.env,
        DATABASE_URL: databaseUrl,
        DIRECT_URL: process.env.DIRECT_URL || file.DIRECT_URL || databaseUrl,
    },
});