import { prisma } from '@/lib/prisma';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import s3Service from '@/lib/connectors/s3.connector';
import { Prisma } from '@/generated/prisma';
import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { ConfirmBodySchema } from '@/lib/schemas/upload.schema';

export async function POST(request: NextRequest) {
    try {
        const parsed = ConfirmBodySchema.safeParse(await request.json());

        if (!parsed.success) {
            return sargeApiError(`${parsed.error.flatten()}`, 400);
        }

        const { type, key } = parsed.data;

        const ownerId = type === 'user' ? parsed.data.userId : parsed.data.organizationId;
        if (!key.startsWith(`${type}/${ownerId}/`)) {
            return sargeApiError('Key does not match the provided ID', 400);
        }

        const exists = await s3Service.doesKeyExist(key);
        if (!exists) return sargeApiError('Key does not exist', 400);

        const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE;
        if (!cdnBase) return sargeApiError('Could not retrieve CDN URL', 500);

        const imageUrl = `${cdnBase}/${key}`;

        if (type === 'organization') {
            const { organizationId } = parsed.data;

            await prisma.organization.update({
                where: {
                    id: organizationId,
                },
                data: {
                    imageUrl,
                },
            });

            return sargeApiResponse({ imageUrl }, 200);
        }

        const { userId } = parsed.data;

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                imageUrl,
            },
        });

        return sargeApiResponse({ imageUrl }, 200);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return sargeApiError(error.message, 400);
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
            return sargeApiError(error.message, 404);
        }

        return sargeApiError('Internal server error', 500);
    }
}
