import {
    type PositionPreviewResponse,
    type ApplicationDisplayInfo,
} from '@/lib/types/position.types';
import { type AddApplicationWithCandidateDataDTO } from '@/lib/schemas/application.schema';
import { type BatchAddResult, type PositionWithCounts } from '@/lib/types/position.types';
import { type Position } from '@/generated/prisma';

/**
 * POST /api/positions
 */
export async function createPosition(title: string): Promise<Position> {
    const res = await fetch(`/api/positions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * GET /api/positions/:positionId/candidates
 */
export async function getCandidates(positionId: string): Promise<ApplicationDisplayInfo[]> {
    const res = await fetch(`/api/positions/${positionId}/candidates`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * GET /api/positions/:positionId
 */
export async function getPosition(positionId: string): Promise<Position> {
    const res = await fetch(`/api/positions/${positionId}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json?.message);
    }

    return json.data;
}

/**
 * GET api/positions?orgId=
 */
export async function getPositionsByOrgId(orgId: string): Promise<PositionWithCounts[]> {
    const res = await fetch(`/api/positions?orgId=${orgId}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * POST /api/positions/:positionId/candidates
 */
export async function createCandidate(
    positionId: string,
    payload: AddApplicationWithCandidateDataDTO
): Promise<ApplicationDisplayInfo> {
    const res = await fetch(`/api/positions/${positionId}/candidates`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * POST /api/positions/:positionId/candidates/batch
 */
export async function batchCreateCandidates(
    positionId: string,
    candidates: AddApplicationWithCandidateDataDTO[]
): Promise<BatchAddResult> {
    const res = await fetch(`/api/positions/${positionId}/candidates/batch`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applications: candidates }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * POST /api/positions/:positionId/candidates/csv
 */
export async function csvCreateCandidates(
    positionId: string,
    formData: FormData
): Promise<AddApplicationWithCandidateDataDTO[]> {
    const res = await fetch(`/api/positions/${positionId}/candidates/csv`, {
        method: 'POST',
        body: formData,
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * GET /api/positions/:positionId/preview
 */
export async function getPositionPreview(positionId: string): Promise<PositionPreviewResponse> {
    const res = await fetch(`/api/positions/${positionId}/preview`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * GET /api/positions/search/?title=...
 */
export async function searchPositions(title: string): Promise<PositionWithCounts[]> {
    const res = await fetch(`/api/positions/search/?title=${title}`);

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}
