import fs from 'node:fs';
import crypto from 'node:crypto';
import readline from 'node:readline/promises';

// already set up? do nothing
if (fs.existsSync('.env')) process.exit(0);

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = async (q) => (await rl.question(`${q} (enter to skip): `)).trim();
const secret = () => crypto.randomBytes(32).toString('hex');

console.log("\nNo .env found, let's set up Sarge.\n");

const env = {
    DATABASE_URL: 'postgresql://postgres:password@localhost:5432/sarge',
    DIRECT_URL: 'postgresql://postgres:password@localhost:5432/sarge',
    BETTER_AUTH_URL: 'http://localhost:3000',
    NEXT_PUBLIC_WS_URL: 'ws://localhost:3000/api/ws',
    AWS_SECRET_NAME: await ask('AWS secret name'),
    NEXT_PUBLIC_CDN_BASE: await ask('CDN base URL'),
    BETTER_AUTH_SECRET: secret(),
    JWT_SECRET: secret(),
    INTERNAL_API_SECRET: secret(),
    EMAIL_DOMAIN: await ask('Email domain'),
    JUDGE_URL: await ask('Judge0 URL'),
    JUDGE_API_KEY: await ask('Judge0 API key'),
    AWS_ACCESS_KEY_ID: await ask('AWS access key ID'),
    AWS_SECRET_ACCESS_KEY: await ask('AWS secret access key'),
    AWS_BUCKET_NAME: await ask('AWS bucket name'),
};
rl.close();

const lines = Object.entries(env).map(([k, v]) => `${k}=${v}`);
fs.writeFileSync('.env', lines.join('\n') + '\n');

console.log('\n.env created!\n');
