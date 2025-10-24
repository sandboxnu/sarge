import { mime, z } from 'zod';
import { prisma } from '@/lib/prisma';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import s3Service from '@/lib/services/s3.service';
import { isUserAdmin } from '@/lib/utils/permissions.utils';
import { type NextRequest } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';

const PresignBodySchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('user'),
        mime: z.string().min(3),
        userId: z.uuid(),
        organizationId: z.uuid().optional(),
    }),
    z.object({
        type: z.literal('organization'),
        mime: z.string().min(3),
        organizationId: z.uuid(),
        userId: z.uuid().optional(),
    }),
]);

export async function POST(request: NextRequest) {
    try {
        const parsed = PresignBodySchema.safeParse(await request.json());

        if (!parsed.success) {
            return sargeApiError(`${parsed.error.flatten()}`, 400);
        }

        console.log('Successfully parsed');

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

        console.log('About to sign');

        const res = await s3Service.getSignedURL(type, userId, mime);
        return sargeApiResponse(res, 200);
    } catch (error) {
        return sargeApiError(`Error retrieving signed URL: ${error}`, 500);
    }
}
