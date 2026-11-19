import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { submitFeedbackSchema } from '@/lib/schemas/feedback.schema';
import FeedbackService from '@/lib/services/feedback.service';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        const body = await request.json();
        const parsed = submitFeedbackSchema.parse(body);

        await FeedbackService.submitFeedback(
            parsed,
            session.userId,
            session.activeOrganizationId,
            session.role
        );

        return Response.json({ data: { success: true } }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
