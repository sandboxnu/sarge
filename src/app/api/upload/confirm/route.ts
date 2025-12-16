import { prisma } from '@/lib/prisma';
import s3Connector from '@/lib/connectors/s3.connector';
import { type NextRequest } from 'next/server';
import { ConfirmBodySchema } from '@/lib/schemas/upload.schema';
import {
    BadRequestException,
    handleError,
    InternalServerException,
} from '@/lib/utils/errors.utils';

export async function POST(request: NextRequest) {
    try {
        const parsed = ConfirmBodySchema.parse(await request.json());

        const { type, key } = parsed;

        const ownerId = type === 'user' ? parsed.userId : parsed.organizationId;
        if (!key.startsWith(`${type}/${ownerId}/`)) {
            throw new BadRequestException('Key does not match the provided ID');
        }

        const exists = await s3Connector.doesKeyExist(key);
        if (!exists) throw new BadRequestException('Key does not exist');

        const cdnBase = process.env.NEXT_PUBLIC_CDN_BASE;
        if (!cdnBase) throw new InternalServerException('Could not retrieve CDN URL');

        const imageUrl = `${cdnBase}/${key}`;

        if (type === 'organization') {
            await prisma.organization.update({
                where: {
                    id: parsed.organizationId,
                },
                data: {
                    logo: imageUrl,
                },
            });

            return Response.json({ data: { imageUrl } }, { status: 200 });
        }

        await prisma.user.update({
            where: {
                id: parsed.userId,
            },
            data: {
                image: imageUrl,
            },
        });

        return Response.json({ data: { imageUrl } }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}
