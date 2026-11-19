import { z } from 'zod';

export const FEEDBACK_MAX_LENGTH = 5000;

export const submitFeedbackSchema = z.object({
    feedback: z
        .string()
        .trim()
        .min(1, 'Feedback is required')
        .max(FEEDBACK_MAX_LENGTH, `Feedback must be ${FEEDBACK_MAX_LENGTH} characters or less`),
    // Only http(s) URLs, so mail clients won't auto-link e.g. a `javascript:` URL.
    pageUrl: z.url({ protocol: /^https?$/, error: 'Invalid page URL' }).max(2048),
});

export type SubmitFeedbackDTO = z.infer<typeof submitFeedbackSchema>;
