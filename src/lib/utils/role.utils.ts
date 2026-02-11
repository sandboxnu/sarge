import { ForbiddenException } from '@/lib/utils/errors.utils';

export const ORG_ROLES = ['owner', 'admin', 'recruiter', 'reviewer', 'member'] as const;
export type OrgRole = (typeof ORG_ROLES)[number];

export const ROLE_RANK: Record<OrgRole, number> = {
    owner: 5,
    admin: 4,
    recruiter: 3,
    reviewer: 2,
    member: 1,
};

export function hasRoleAtLeast(role: OrgRole | null | undefined, minimumRole: OrgRole): boolean {
    if (!role) return false;
    return ROLE_RANK[role] >= ROLE_RANK[minimumRole];
}

export function isRecruiterOrAbove(role: OrgRole | null | undefined): boolean {
    return hasRoleAtLeast(role, 'recruiter');
}

export function assertRoleAtLeast(
    role: OrgRole | null | undefined,
    minimumRole: OrgRole,
    message = 'You do not have permission to perform this action'
): void {
    if (!hasRoleAtLeast(role, minimumRole)) {
        throw new ForbiddenException(message);
    }
}

export function assertRecruiterOrAbove(
    role: OrgRole | null | undefined,
    message = 'You do not have permission to perform this action'
): void {
    assertRoleAtLeast(role, 'recruiter', message);
}
