'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { type z } from 'zod';
import { submitFeedback } from '@/lib/api/feedback';
import { submitFeedbackSchema } from '@/lib/schemas/feedback.schema';

type UseFeedbackModalArgs = {
    onOpenChange: (open: boolean) => void;
};

// The form only collects the feedback text; the page URL is captured at submit time.
const feedbackFormSchema = submitFeedbackSchema.pick({ feedback: true });
type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

export default function useFeedbackModal({ onOpenChange }: UseFeedbackModalArgs) {
    const form = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackFormSchema),
        defaultValues: { feedback: '' },
    });

    const { isSubmitting } = form.formState;

    const handleSubmit = async (values: FeedbackFormValues) => {
        try {
            await submitFeedback({ feedback: values.feedback, pageUrl: window.location.href });
        } catch (err) {
            form.setError('root', {
                message:
                    err instanceof Error && err.message
                        ? err.message
                        : 'Could not submit feedback. Please try again.',
            });
            return;
        }

        toast.success('Thanks! Your feedback has been submitted.');
        form.reset();
        onOpenChange(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            // Keep the modal open while a request is in flight so its result isn't lost.
            if (isSubmitting) return;
            form.reset();
        }
        onOpenChange(nextOpen);
    };

    return {
        form,
        isSubmitting,
        handleSubmit,
        handleOpenChange,
    };
}
