import { prisma } from '@/lib/prisma';
import { badRequest, error, forbidden, notFound, success, unAuthenticated } from '@/lib/responses';
import s3Service from '@/lib/connectors/s3.connector';
import { isUserAdmin } from '@/lib/utils/permissions.utils';
import { type NextRequest } from 'next/server';
import { SignBodySchema } from '@/lib/schemas/upload.schema';

export async function POST(request: NextRequest) {
    try {
        const parsed = SignBodySchema.safeParse(await request.json());

        if (!parsed.success) {
            return badRequest('Invalid sign data', parsed.error);
        }

        const { type, mime, userId } = parsed.data;
        if (!userId) {
            return unAuthenticated('User not authenticated');
        }

        if (type === 'organization') {
            const { organizationId } = parsed.data;

            const organization = await prisma.organization.findFirst({
                where: {
                    id: organizationId,
                },
            });

            if (!organization) {
                return notFound('Organization', organizationId);
            }

            const allowed = await isUserAdmin(userId, organizationId);
            if (!allowed) {
                return forbidden(`User ${userId} is not authorized`);
            }

            const res = await s3Service.getSignedURL(type, organizationId, mime);
            return success(res, 200);
        }

        const res = await s3Service.getSignedURL(type, userId, mime);
        return success(res, 200);
    } catch (err) {
        return error(`Error retrieving signed URL: ${err}`);
    }
}
