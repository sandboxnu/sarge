import { type Application } from '@/generated/prisma';
import { type ApplicationWithReviewData } from '@/lib/types/position.types';

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

/**
 * GET /api/applications/:applicationId
 * Fetches a single application's full review tree (assessment + tasks + reviews + snapshots).
 */
export async function getApplicationForReview(
    applicationId: string
): Promise<ApplicationWithReviewData> {
    const res = await fetch(`/api/applications/${applicationId}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
