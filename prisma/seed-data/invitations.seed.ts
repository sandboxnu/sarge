const orgId = 'org_nextlab_001';
const inviterId = 'user_prof_fontenot_001';

export const invitationsSeedData: Array<{
    id: string;
    email: string;
    role: string;
    status: 'pending';
    expiresAt: Date;
    createdAt: Date;
    organizationId: string;
    inviterId: string;
}> = [
    {
        id: 'invite_seed_olivia_expired',
        organizationId: orgId,
        email: 'oliviali@gmail.com',
        role: 'recruiter',
        status: 'pending',
        createdAt: new Date('2026-02-19T15:00:00Z'),
        expiresAt: new Date('2026-03-01T15:00:00Z'),
        inviterId,
    },
    {
        id: 'invite_seed_pending_recruiter',
        organizationId: orgId,
        email: 'hiring.pending@gmail.com',
        role: 'recruiter',
        status: 'pending',
        createdAt: new Date('2026-02-19T16:00:00Z'),
        expiresAt: new Date('2026-07-01T15:00:00Z'),
        inviterId,
    },
    {
        id: 'invite_seed_pending_admin',
        organizationId: orgId,
        email: 'ops.pending@gmail.com',
        role: 'admin',
        status: 'pending',
        createdAt: new Date('2026-02-19T17:00:00Z'),
        expiresAt: new Date('2026-07-15T15:00:00Z'),
        inviterId,
    },
];
