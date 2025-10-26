import { prisma } from '@/lib/prisma';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import s3Service from '@/lib/connectors/s3.connector';
import { isUserAdmin } from '@/lib/utils/permissions.utils';
import { type NextRequest } from 'next/server';
import { SignBodySchema } from '@/lib/schemas/upload.schema';

export async function POST(request: NextRequest) {
    try {
        const parsed = SignBodySchema.safeParse(await request.json());

        if (!parsed.success) {
            return sargeApiError(`${parsed.error.flatten()}`, 400);
        }

        const { type, mime, userId } = parsed.data;
        if (!userId) {
            return sargeApiError('User not authenticated', 401);
        }

        if (type === 'organization') {
            const { organizationId } = parsed.data;

            const organization = await prisma.organization.findFirst({
                where: {
                    id: organizationId,
                },
            });

            if (!organization) {
                return sargeApiError(`Organization with ID ${organizationId} does not exist`, 400);
            }

            const allowed = await isUserAdmin(userId, organizationId);
            if (!allowed) {
                return sargeApiError(`User ${userId} is not authorized`, 403);
            }

            const res = await s3Service.getSignedURL(type, organizationId, mime);
            return sargeApiResponse(res, 200);
        }

        const res = await s3Service.getSignedURL(type, userId, mime);
        return sargeApiResponse(res, 200);
    } catch (error) {
        return sargeApiError(`Error retrieving signed URL: ${error}`, 500);
    }
}
