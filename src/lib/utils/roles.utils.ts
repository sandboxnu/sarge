import { ROLES_WITH_INVITE_PERMISSION } from '@/lib/auth/permissions';

export const ROLE_HIERARCHY = ['owner', 'admin', 'recruiter', 'reviewer', 'member'] as const;
export type OrgRole = (typeof ROLE_HIERARCHY)[number];

export const ROLE_DISPLAY_NAMES: Record<OrgRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    recruiter: 'Recruiter',
    reviewer: 'Reviewer',
    member: 'Member',
};

/**
 * Whether the given role has invitation:create permission.
 */
export function canInviteMembers(role: string): boolean {
    return ROLES_WITH_INVITE_PERMISSION.has(role);
}

/**
 * Returns roles strictly below the given role in the hierarchy.
 * This is UI only filtering - Better Auth's server enforces
 * the actual invitation:create permission check :)
 */
export function getInvitableRoles(currentUserRole: string): OrgRole[] {
    const index = ROLE_HIERARCHY.indexOf(currentUserRole as OrgRole);
    if (index === -1) return [];
    return [...ROLE_HIERARCHY.slice(index + 1)];
}
