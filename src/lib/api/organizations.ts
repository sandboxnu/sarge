import {
    type CreateOrganizationDTO,
    type UpdateOrganizationDTO,
} from '@/lib/schemas/organization.schema';
import type { UpdateInvitationRolePayload } from '@/lib/schemas/role.schema';
import { type Organization } from '@/generated/prisma';
import type { OrgMembersAndInvitations } from '@/lib/types/invitation.types';
import { authClient } from '@/lib/auth/auth-client';

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
): Promise<void> {
    const res = await fetch(`/api/organizations/${organizationId}/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        return;
    }

    const json = await res.json();
    throw new Error(json.message ?? `Failed to update invitation (${res.status})`);
}

/**
 * DELETE /api/organizations/:organizationId/invitations/:invitationId
 */
export async function deleteOrganizationInvitation(
    organizationId: string,
    invitationId: string
): Promise<void> {
    const res = await fetch(`/api/organizations/${organizationId}/invitations/${invitationId}`, {
        method: 'DELETE',
    });

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

/**
 * POST /api/invitations/resolve-code
 */
export async function resolveInvitationCode(
    code: string
): Promise<{ invitationId: string; organizationId: string }> {
    const res = await fetch('/api/invitations/resolve-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.message ?? 'That code is invalid or has expired.');
    }

    return json.data;
}

/**
 * POST /api/invitations/:invitationId/resend
 */
export async function requestNewInvitationLink(invitationId: string): Promise<void> {
    await fetch(`/api/invitations/${invitationId}/resend`, { method: 'POST' });
}

// authClient returns { error } instead of throwing; this throws so callers get one failure path
export async function acceptInvitationAndActivate(
    invitationId: string,
    organizationId: string
): Promise<void> {
    const accepted = await authClient.organization.acceptInvitation({ invitationId });
    if (accepted.error) {
        throw new Error(accepted.error.message ?? 'Failed to accept invitation');
    }

    // errors ignored: accept already activated the org server-side, this only syncs the client
    await authClient.organization.setActive({ organizationId });
}
