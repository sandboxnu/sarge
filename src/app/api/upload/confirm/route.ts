import { prisma } from '@/lib/prisma';
import { badRequest, error, handleError, success } from '@/lib/responses';
import s3Service from '@/lib/connectors/s3.connector';
import { type NextRequest } from 'next/server';
import { ConfirmBodySchema } from '@/lib/schemas/upload.schema';

export async function POST(request: NextRequest) {
    try {
        const parsed = ConfirmBodySchema.safeParse(await request.json());

        if (!parsed.success) {
            return Response.json(badRequest('Invalid confirm data', parsed.error));
        }

        const { type, key } = parsed.data;

        const ownerId = type === 'user' ? parsed.data.userId : parsed.data.organizationId;
        if (!key.startsWith(`${type}/${ownerId}/`)) {
            return Response.json(badRequest('Key does not match the provided ID'));
        }

        const exists = await s3Service.doesKeyExist(key);
        if (!exists) return Response.json(badRequest('Key does not exist'));

        const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE;
        if (!cdnBase) return Response.json(error('Could not retrieve CDN URL', 500));

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

            return Response.json(success({ imageUrl }, 200));
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

        return Response.json(success({ imageUrl }, 200));
    } catch (error) {
        return Response.json(handleError(error));
    }
}
