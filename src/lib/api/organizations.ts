import {
    type CreateOrganizationDTO,
    type UpdateOrganizationDTO,
} from '@/lib/schemas/organization.schema';
import { type Organization } from '@/generated/prisma';

/**
 * POST /api/organizations
 */
export async function createOrganization(payload: CreateOrganizationDTO): Promise<Organization> {
    const res = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message);
    }

    return json.data;
}

/**
 * PUT /api/organizations/:organizationId
 */
export async function updateOrganization(
    organizationId: string,
    payload: UpdateOrganizationDTO
): Promise<Organization> {
    const res = await fetch(`/api/organizations/${organizationId}`, {
        method: 'PUT',
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
