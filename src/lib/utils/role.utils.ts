export const ORG_ROLES = ['owner', 'admin', 'recruiter', 'reviewer', 'member'] as const;
export type OrgRole = (typeof ORG_ROLES)[number];
