import {
    type CreateOrganizationDTO,
    type UpdateOrganizationDTO,
} from '@/lib/schemas/organization.schema';
import type { UpdateInvitationRolePayload } from '@/lib/schemas/role.schema';
import { type Organization } from '@/generated/prisma';
import type { OrgInvitation, OrgMembersAndInvitations } from '@/lib/types/invitation.types';

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

/**
 * GET /api/organizations/:organizationId/members
 */
export async function getOrganizationMembers(
    organizationId: string
): Promise<OrgMembersAndInvitations> {
    const res = await fetch(`/api/organizations/${organizationId}/members`);

    if (!res.ok) {
        throw new Error(`Failed to load members (${res.status})`);
    }

    const json = await res.json();
    return json.data as OrgMembersAndInvitations;
}

/**
 * PATCH /api/organizations/:organizationId/invitations/:invitationId
 */
export async function updateInvitationRole(
    organizationId: string,
    invitationId: string,
    payload: UpdateInvitationRolePayload
): Promise<OrgInvitation> {
    const res = await fetch(
        `/api/organizations/${organizationId}/invitations/${invitationId}`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }
    );

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message ?? `Failed to update invitation (${res.status})`);
    }

    return json.data as OrgInvitation;
}

/**
 * DELETE /api/organizations/:organizationId/invitations/:invitationId
 */
export async function deleteOrganizationInvitation(
    organizationId: string,
    invitationId: string
): Promise<void> {
    const res = await fetch(
        `/api/organizations/${organizationId}/invitations/${invitationId}`,
        { method: 'DELETE' }
    );

    if (res.ok) {
        return;
    }

    const json = await res.json();
    throw new Error(json.message ?? `Failed to remove invitation (${res.status})`);
}

/**
 * POST /api/organizations/:organizationId/transfer-ownership
 */
export async function transferOwnership(
    organizationId: string,
    targetMemberId: string
): Promise<void> {
    const res = await fetch(`/api/organizations/${organizationId}/transfer-ownership`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetMemberId }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message ?? `Failed to transfer ownership (${res.status})`);
    }
}
