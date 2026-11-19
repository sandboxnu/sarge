import { prisma } from '@/lib/prisma';
import sesConnector from '@/lib/connectors/ses.connector';
import { InternalServerException, NotFoundException } from '@/lib/utils/errors.utils';
import { getRoleLabel } from '@/lib/utils/roles.utils';
import type { SubmitFeedbackDTO } from '@/lib/schemas/feedback.schema';

const SEND_FAILED_MESSAGE = 'Could not submit feedback. Please try again later.';

/**
 * Emails user-submitted feedback to the address configured in FEEDBACK_EMAIL.
 * User email, organization, role, and timestamp are resolved server-side from
 * the session so they can't be spoofed by the client.
 */
async function submitFeedback(
    payload: SubmitFeedbackDTO,
    userId: string,
    organizationId: string,
    role: string
): Promise<void> {
    const recipient = process.env.FEEDBACK_EMAIL;
    if (!recipient) {
        // Log the real cause server-side; don't expose config details to the client.
        console.error('Feedback submission failed: FEEDBACK_EMAIL is not configured');
        throw new InternalServerException(SEND_FAILED_MESSAGE);
    }

    const [user, organization] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { email: true } }),
        prisma.organization.findUnique({ where: { id: organizationId }, select: { name: true } }),
    ]);

    if (!user) throw new NotFoundException('User', userId);
    if (!organization) throw new NotFoundException('Organization', organizationId);

    const submittedAt = new Date().toISOString();

    // Server-derived metadata goes first so user-entered text can't impersonate it.
    const body = [
        `User email: ${user.email}`,
        `Organization: ${organization.name}`,
        `Role: ${getRoleLabel(role)}`,
        `Page: ${payload.pageUrl}`,
        `Submitted at: ${submittedAt}`,
        ``,
        `---- Feedback ----`,
        payload.feedback,
    ].join('\n');

    let sent: boolean;
    try {
        sent = await sesConnector.sendEmail(
            recipient,
            `[Sarge Feedback] ${organization.name} - ${user.email}`,
            body
        );
    } catch (err) {
        // SES errors can include recipient addresses and AWS account details.
        console.error('Feedback submission failed: SES error', err);
        throw new InternalServerException(SEND_FAILED_MESSAGE);
    }

    if (!sent) {
        console.error('Feedback submission failed: SES returned no MessageId');
        throw new InternalServerException(SEND_FAILED_MESSAGE);
    }
}

const FeedbackService = {
    submitFeedback,
};

export default FeedbackService;
