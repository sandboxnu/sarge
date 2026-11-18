'use client';

import { X } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/lib/components/ui/Field';
import { Textarea } from '@/lib/components/ui/Textarea';
import useFeedbackModal from '@/lib/hooks/useFeedbackModal';
import { FEEDBACK_MAX_LENGTH } from '@/lib/schemas/feedback.schema';

type FeedbackModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function FeedbackModal({ open, onOpenChange }: FeedbackModalProps) {
    const { form, isSubmitting, handleSubmit, handleOpenChange } = useFeedbackModal({
        onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="px-7 py-6" showCloseButton={false}>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Submit feedback</DialogTitle>
                        <Button
                            type="button"
                            variant="icon"
                            aria-label="Close"
                            onClick={() => handleOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            <X />
                        </Button>
                    </div>
                    <DialogDescription className="sr-only">
                        Share feedback about Sarge with the team.
                    </DialogDescription>

                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FieldGroup className="gap-4">
                            <Controller
                                name="feedback"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2">
                                        <FieldLabel
                                            htmlFor="feedback-text"
                                            className="text-label-s"
                                        >
                                            Enter feedback
                                        </FieldLabel>
                                        <Textarea
                                            {...field}
                                            id="feedback-text"
                                            placeholder="Tell us what's working, what's broken, or what you'd like to see"
                                            maxLength={FEEDBACK_MAX_LENGTH}
                                            aria-invalid={fieldState.invalid}
                                            disabled={isSubmitting}
                                            className="text-body-s min-h-[160px] resize-y"
                                            autoFocus
                                        />
                                        <FieldError
                                            errors={
                                                fieldState.error ? [fieldState.error] : undefined
                                            }
                                        />
                                    </Field>
                                )}
                            />
                        </FieldGroup>

                        {form.formState.errors.root && (
                            <p className="text-sarge-error-700 text-body-xs">
                                {form.formState.errors.root.message}
                            </p>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <Button
                                type="button"
                                variant="link"
                                onClick={() => handleOpenChange(false)}
                                disabled={isSubmitting}
                                className="text-label-s"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSubmitting}
                                className="text-label-s text-sarge-gray-50 h-9 px-4"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
