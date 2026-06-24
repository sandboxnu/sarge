import { auth } from '@/lib/auth/auth';
import { ForbiddenException } from '@/lib/utils/errors.utils';
import type { ac, adminAccessControl } from '@/lib/auth/permissions';

type OrgPermissionMap = Partial<{
    [R in keyof typeof ac.statements]: Array<(typeof ac.statements)[R][number]>;
}>;

type AdminPermissionMap = Partial<{
    [R in keyof typeof adminAccessControl.statements]: Array<
        (typeof adminAccessControl.statements)[R][number]
    >;
}>;

export async function hasOrgPermission(
    headers: Headers,
    permissions: OrgPermissionMap
): Promise<boolean> {
    return (
        await auth.api.hasPermission({
            headers,
            body: {
                permissions,
            },
        })
    ).success;
}

export async function assertOrgPermission(
    headers: Headers,
    permissions: OrgPermissionMap,
    message = 'You do not have permission to perform this action'
): Promise<void> {
    const allowed = await hasOrgPermission(headers, permissions);
    if (!allowed) {
        throw new ForbiddenException(message);
    }
}

export async function hasAdminPermission(
    headers: Headers,
    permissions: AdminPermissionMap
): Promise<boolean> {
    return (
        await auth.api.userHasPermission({
            headers,
            body: {
                permissions,
            },
        })
    ).success;
}

export async function assertAdminPermission(
    headers: Headers,
    permissions: AdminPermissionMap,
    message = 'Admin permission required'
): Promise<void> {
    const allowed = await hasAdminPermission(headers, permissions);
    if (!allowed) {
        throw new ForbiddenException(message);
    }
}

export async function assertRecruiterOrAbove(
    headers: Headers,
    message = 'Recruiter role or above required'
): Promise<void> {
    await assertOrgPermission(headers, { assessment: ['assign'] }, message);
}

export async function assertAdminOrOwner(
    headers: Headers,
    message = 'Admin or owner role required'
): Promise<void> {
    await assertOrgPermission(headers, { organization: ['update'] }, message);
}

export async function assertOwner(
    headers: Headers,
    message = 'Owner role required'
): Promise<void> {
    await assertOrgPermission(headers, { organization: ['delete'] }, message);
}

export async function assertSuperUser(
    headers: Headers,
    message = 'Superuser role required'
): Promise<void> {
    // This is equivalent to asserting "is the superuser". since superuser holds every admin statement.
    await assertAdminPermission(headers, { user: ['list'] }, message);
}
