import 'server-only';
import { type User } from '@/generated/prisma';

export async function canView(target: User, requester: User): Promise<boolean> {
    if (target.id === requester.id) {
        return true;
    } else if (target.orgId === requester.orgId) {
        return true;
    }
    return false;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function canModify(target: User, requester: User): Promise<boolean> {
    return false;
}
