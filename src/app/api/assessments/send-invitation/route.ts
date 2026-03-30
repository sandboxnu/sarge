import { type NextRequest } from 'next/server';
import { z } from 'zod';
import { handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import { prisma } from '@/lib/prisma';
import sesConnector from '@/lib/connectors/ses.connector';
import { generateAssessmentInvitationHTML } from '@/lib/templates/assessment-invitation-email';
import { type Application } from '@/generated/prisma';

const sendAssessmentInvitationSchema = z.object({
    candidateId: z.string().cuid(),
});

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);

        const body = await request.json();
        const { candidateId } = sendAssessmentInvitationSchema.parse(body);

        const candidate = await prisma.candidate.findUnique({
            where: { id: candidateId },
            include: {
                applications: {
                    include: {
                        assessment: true,
                        position: true,
                    },
                },
                organization: true,
            },
        });

        //validation
        if (!candidate) {
            return Response.json({ error: 'Candidate not found' }, { status: 404 });
        }

        if (candidate.orgId !== session.activeOrganizationId) {
            return Response.json({ error: 'Unauthorized' }, { status: 403 });
        }

        const applicationWithAssessment = candidate.applications.find(
            (app: Application & { assessment: any }) => app.assessment !== null
        );

        if (!applicationWithAssessment || !applicationWithAssessment.assessment) {
            return Response.json(
                { error: 'Candidate does not have an assigned assessment' },
                { status: 400 }
            );
        }

        const assessment = applicationWithAssessment.assessment;
        const position = applicationWithAssessment.position;
        const organization = candidate.organization;

        //create url
        const baseUrl =
            process.env.BETTER_AUTH_URL ||
            process.env.NEXT_PUBLIC_APP_URL ||
            'http://localhost:3000';
        const assessmentUrl = `${baseUrl}/assessment/${assessment.uniqueLink}`;
        const logoUrl = `${baseUrl}/Sarge_logo.svg`;

        //email html
        const htmlContent = generateAssessmentInvitationHTML({
            candidateName: candidate.name,
            positionTitle: position.title,
            organizationName: organization.name,
            assessmentId: assessment.id,
            assessmentUrl,
            logoUrl,
        });

        //send email
        const emailSent = await sesConnector.sendEmail(
            candidate.email,
            `${organization.name} Software Engineering Role: Online Assessment Invitation`,
            `Hello ${candidate.name}, you have been invited to complete an online assessment for the ${position.title} position at ${organization.name}. Visit ${assessmentUrl} to begin.`,
            { html: htmlContent }
        );

        if (!emailSent) {
            return Response.json({ error: 'Failed to send invitation email' }, { status: 500 });
        }

        return Response.json(
            {
                data: {
                    success: true,
                    message: `Assessment invitation sent to ${candidate.email}`,
                    candidateName: candidate.name,
                    positionTitle: position.title,
                    assessmentId: assessment.id,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        return handleError(err);
    }
}
