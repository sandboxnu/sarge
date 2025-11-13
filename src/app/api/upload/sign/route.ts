import { prisma } from '@/lib/prisma';
import s3Service from '@/lib/connectors/s3.connector';
import { type NextRequest } from 'next/server';
import { SignBodySchema } from '@/lib/schemas/upload.schema';
import { handleError, NotFoundException, UnauthorizedException } from '@/lib/utils/errors.utils';

export async function POST(request: NextRequest) {
    try {
        const parsed = SignBodySchema.parse(await request.json());

        const { type, mime, userId, organizationId } = parsed;
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }

        if (type === 'organization') {
            const organization = await prisma.organization.findFirst({
                where: {
                    id: organizationId,
                },
            });

            if (!organization) {
                throw new NotFoundException('Organization', organizationId);
            }

            // const allowed = await isUserAdmin(userId, organizationId); TODO: revist with new permissions system
            // if (!allowed) {
            //     return Response.json(forbidden(`User ${userId} is not authorized`));
            // }

            const res = await s3Service.getSignedURL(type, organizationId, mime);
            return Response.json({ data: res }, { status: 200 });
        }

        const res = await s3Service.getSignedURL(type, userId, mime);
        return Response.json({ data: res }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
