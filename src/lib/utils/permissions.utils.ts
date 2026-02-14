import { auth } from '@/lib/auth/auth';
import { ForbiddenException } from '@/lib/utils/errors.utils';
import type { ac } from '@/lib/auth/permissions';

type PermissionMap = Partial<{
    [R in keyof typeof ac.statements]: Array<(typeof ac.statements)[R][number]>;
}>;

export async function hasPermission(
    headers: Headers,
    permissions: PermissionMap
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

export async function assertPermission(
    headers: Headers,
    permissions: PermissionMap,
    message = 'You do not have permission to perform this action'
): Promise<void> {
    const allowed = await hasPermission(headers, permissions);
    if (!allowed) {
        throw new ForbiddenException(message);
    }
}

export async function assertRecruiterOrAbove(
    headers: Headers,
    message = 'Recruiter role or above required'
): Promise<void> {
    await assertPermission(headers, { assessment: ['assign'] }, message);
}
