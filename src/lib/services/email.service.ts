import { prisma } from '@/lib/prisma';
import sesConnector from '@/lib/connectors/ses.connector';
import { generateAssessmentInvitationHTML } from '@/lib/templates/invitation';
import { formatDeadline } from '@/lib/utils/date.utils';

interface SendAssessmentInvitationResult {
    success: boolean;
    message: string;
    candidateName: string;
    positionTitle: string;
    assessmentId: string;
}

export async function sendAssessmentInvitationEmail(
    candidateId: string,
    activeOrganizationId: string
): Promise<SendAssessmentInvitationResult> {
    const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
        include: {
            applications: {
                include: {
                    assessment: {
                        include: {
                            assessmentTemplate: {
                                include: {
                                    tasks: {
                                        include: {
                                            taskTemplate: {
                                                select: { estimatedTime: true },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    position: true,
                },
            },
            organization: true,
        },
    });

    if (!candidate) {
        throw new Error('Candidate not found');
    }

    if (candidate.orgId !== activeOrganizationId) {
        throw new Error('Unauthorized');
    }

    const applicationWithAssessment = candidate.applications.find((app) => app.assessment !== null);

    if (!applicationWithAssessment?.assessment) {
        throw new Error('Candidate does not have an assigned assessment');
    }

    const assessment = applicationWithAssessment.assessment;
    const position = applicationWithAssessment.position;
    const organization = candidate.organization;

    const baseUrl =
        process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const assessmentUrl = `${baseUrl}/assessment/${assessment.uniqueLink}`;
    const logoUrl = `${baseUrl}/Sarge_logo.svg`;

    const durationMinutes = assessment.assessmentTemplate.tasks.reduce(
        (sum, task) => sum + task.taskTemplate.estimatedTime,
        0
    );
    const expirationDate = formatDeadline(assessment.deadline);
    const htmlContent = generateAssessmentInvitationHTML({
        candidateName: candidate.name,
        positionTitle: position.title,
        organizationName: organization.name,
        assessmentId: assessment.id,
        assessmentUrl,
        logoUrl,
        durationMinutes,
        expirationDate,
    });

    // Send email
    const emailSent = await sesConnector.sendEmail(
        candidate.email,
        `${organization.name} Software Engineering Role: Online Assessment Invitation`,
        `Hello ${candidate.name}, you have been invited to complete an online assessment for the ${position.title} position at ${organization.name}. Visit ${assessmentUrl} to begin.`,
        { html: htmlContent }
    );

    if (!emailSent) {
        throw new Error('Failed to send invitation email');
    }

    return {
        success: true,
        message: `Assessment invitation sent to ${candidate.email}`,
        candidateName: candidate.name,
        positionTitle: position.title,
        assessmentId: assessment.id,
    };
}

const emailService = {
    sendAssessmentInvitationEmail,
};

export default emailService;
