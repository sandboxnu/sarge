import { createAccessControl } from 'better-auth/plugins/access';
import {
    defaultStatements,
    ownerAc,
    adminAc,
    memberAc,
} from 'better-auth/plugins/organization/access';

const statement = {
    ...defaultStatements,
    position: ['create', 'read', 'update', 'delete'],
    candidate: ['create', 'read', 'update', 'delete'],
    assessmentTemplate: ['create', 'read', 'update', 'delete'],
    taskTemplate: ['create', 'read', 'update', 'delete'],
    assessment: ['create', 'read', 'update', 'delete', 'assign'],
    review: ['create', 'read', 'update', 'delete'],
    comment: ['create', 'read', 'update', 'delete'],
} as const;

export const ac = createAccessControl(statement);

export const owner = ac.newRole({
    ...ownerAc.statements,
    position: ['create', 'read', 'update', 'delete'],
    candidate: ['create', 'read', 'update', 'delete'],
    assessmentTemplate: ['create', 'read', 'update', 'delete'],
    taskTemplate: ['create', 'read', 'update', 'delete'],
    assessment: ['create', 'read', 'update', 'delete', 'assign'],
    review: ['create', 'read', 'update', 'delete'],
    comment: ['create', 'read', 'update', 'delete'],
});

export const admin = ac.newRole({
    ...adminAc.statements,
    position: ['create', 'read', 'update', 'delete'],
    candidate: ['create', 'read', 'update', 'delete'],
    assessmentTemplate: ['create', 'read', 'update', 'delete'],
    taskTemplate: ['create', 'read', 'update', 'delete'],
    assessment: ['create', 'read', 'update', 'delete', 'assign'],
    review: ['create', 'read', 'update', 'delete'],
    comment: ['create', 'read', 'update', 'delete'],
});

export const recruiter = ac.newRole({
    ...memberAc.statements,
    position: ['create', 'read', 'update', 'delete'],
    candidate: ['create', 'read', 'update', 'delete'],
    assessmentTemplate: ['create', 'read', 'update', 'delete'],
    taskTemplate: ['create', 'read', 'update', 'delete'],
    assessment: ['create', 'read', 'update', 'delete', 'assign'],
    review: ['create', 'read', 'update', 'delete'],
    comment: ['create', 'read', 'update', 'delete'],
});

export const reviewer = ac.newRole({
    ...memberAc.statements,
    position: ['read'],
    candidate: ['read'],
    assessmentTemplate: ['read'],
    taskTemplate: ['read'],
    assessment: ['read'],
    review: ['create', 'read', 'update', 'delete'],
    comment: ['create', 'read', 'update', 'delete'],
});

// Member: Minimal read-only access
export const member = ac.newRole({
    ...memberAc.statements,
});
