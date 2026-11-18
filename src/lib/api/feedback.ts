import { type SubmitFeedbackDTO } from '@/lib/schemas/feedback.schema';

/**
 * POST /api/feedback
 * Submits user feedback, which is emailed to the configured feedback address.
 */
export async function submitFeedback(payload: SubmitFeedbackDTO): Promise<void> {
    const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
}
