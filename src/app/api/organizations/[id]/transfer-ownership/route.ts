import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma';
import OrganizationService from '@/lib/services/organization.service';
import { ForbiddenException, handleError } from '@/lib/utils/errors.utils';
import { assertOwner } from '@/lib/utils/permissions.utils';

const transferOwnershipSchema = z.object({
    targetMemberId: z.string().min(1),
});

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await assertOwner(request.headers);

        const { id: organizationId } = await params;

        const session = await auth.api.getSession({ headers: request.headers });
        if (!session?.session?.activeOrganizationId) {
            throw new ForbiddenException('No active organization');
        }

        if (session.session.activeOrganizationId !== organizationId) {
            throw new ForbiddenException(
                'Active organization ID must match the requested organization ID'
            );
        }

        const currentMember = await prisma.member.findFirst({
            where: {
                userId: session.user.id,
                organizationId,
            },
        });

        if (!currentMember) {
            throw new ForbiddenException('You are not a member of this organization');
        }

        const body = transferOwnershipSchema.parse(await request.json());

        const result = await OrganizationService.transferOwnership(
            organizationId,
            body.targetMemberId,
            currentMember.id,
            request.headers
        );

        return Response.json({ data: result }, { status: 200 });
    } catch (error) {
        return handleError(error);
    }
}
