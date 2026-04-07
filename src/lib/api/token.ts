/**
 * POST /api/token
 */
export async function createToken(email: string): Promise<string> {
    const res = await fetch(`/api/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
