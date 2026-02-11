import { prisma } from '@/lib/prisma';
import s3Connector from '@/lib/connectors/s3.connector';
import { type NextRequest } from 'next/server';
import { SignBodySchema } from '@/lib/schemas/upload.schema';
import { handleError, NotFoundException } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        const parsed = SignBodySchema.parse(await request.json());

        const { type, mime } = parsed;

        if (type === 'organization') {
            const organizationId = session.activeOrganizationId;
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

            const res = await s3Connector.getSignedURL(type, organizationId, mime);
            return Response.json({ data: res }, { status: 200 });
        }

        const res = await s3Connector.getSignedURL(type, session.userId, mime);
        return Response.json({ data: res }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
