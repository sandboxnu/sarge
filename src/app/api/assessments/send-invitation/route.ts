import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import emailService from '@/lib/services/email.service';
import { prisma } from '@/lib/prisma';
import { AssessmentStatus } from '@/generated/prisma';

const sendAssessmentInvitationSchema = z.object({
    positionId: z.string().cuid(),
});

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);

        const body = await request.json();
        const { positionId } = sendAssessmentInvitationSchema.parse(body);

        const position = await prisma.position.findUnique({
            where: { id: positionId },
            select: { assessmentId: true, orgId: true },
        });

        if (!position) {
            return Response.json({ message: 'Position not found' }, { status: 404 });
        }

        if (position.orgId !== session.activeOrganizationId) {
            return Response.json({ message: 'Unauthorized' }, { status: 403 });
        }

        if (!position.assessmentId) {
            return Response.json(
                { message: 'Position does not have an assessment template assigned' },
                { status: 400 }
            );
        }

        const applications = await prisma.application.findMany({
            where: {
                positionId,
                assessmentStatus: AssessmentStatus.NOT_SENT,
            },
            include: {
                candidate: true,
            },
        });

        const results = [];
        for (const application of applications) {
            try {
                const result = await emailService.sendAssessmentInvitationEmail(
                    application.candidate.id,
                    session.activeOrganizationId
                );

                await prisma.application.update({
                    where: { id: application.id },
                    data: { assessmentStatus: AssessmentStatus.NOT_STARTED },
                });

                results.push({
                    ...result,
                    applicationId: application.id,
                });
            } catch (err) {
                results.push({
                    success: false,
                    message: `Failed to send invitation to ${application.candidate.name}: ${(err as Error).message}`,
                    candidateName: application.candidate.name,
                    positionTitle: '',
                    assessmentId: '',
                });
            }
        }

        return Response.json(
            {
                data: {
                    totalSent: results.filter((r) => r.success).length,
                    totalFailed: results.filter((r) => !r.success).length,
                    results,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        return handleError(err);
    }
}
