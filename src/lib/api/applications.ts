import { type Application } from '@/generated/prisma';

/**
 * GET /api/applications/search/?name=...
 */
export async function searchApplications(name: string): Promise<Application[]> {
    const res = await fetch(`/api/applications/search/?name=${name}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
