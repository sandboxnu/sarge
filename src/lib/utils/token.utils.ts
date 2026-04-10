import { SignJWT } from 'jose';

export async function generateToken(email: string) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);

    const jwt = await new SignJWT({ email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('2h')
        .sign(secret);

    return jwt;
}
