'use client';

import { X } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import useChangePasswordModal from '@/lib/hooks/useChangePasswordModal';

type ChangePasswordModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function ChangePasswordModal({ open, onOpenChange }: ChangePasswordModalProps) {
    const { form, isSubmitting, handleSubmit, handleOpenChange } = useChangePasswordModal({
        onOpenChange,
    });

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="px-7 py-6" showCloseButton={false}>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <DialogTitle>Change password</DialogTitle>
                        <Button
                            type="button"
                            variant="icon"
                            onClick={() => handleOpenChange(false)}
                        >
                            <X />
                        </Button>
                    </div>

                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-4"
                    >
                        <FieldGroup className="gap-4">
                            <Controller
                                name="currentPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2">
                                        <FieldLabel
                                            htmlFor="change-pw-current"
                                            className="text-label-s"
                                        >
                                            Current password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="change-pw-current"
                                            type="password"
                                            autoComplete="current-password"
                                            aria-invalid={fieldState.invalid}
                                            disabled={isSubmitting}
                                            className="text-body-s h-11"
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

                            <Controller
                                name="newPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2">
                                        <FieldLabel
                                            htmlFor="change-pw-new"
                                            className="text-label-s"
                                        >
                                            New password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="change-pw-new"
                                            type="password"
                                            autoComplete="new-password"
                                            aria-invalid={fieldState.invalid}
                                            disabled={isSubmitting}
                                            className="text-body-s h-11"
                                        />
                                        {!fieldState.error && (
                                            <FieldDescription>
                                                Password must be at least 8 characters
                                            </FieldDescription>
                                        )}
                                        <FieldError
                                            errors={
                                                fieldState.error ? [fieldState.error] : undefined
                                            }
                                        />
                                    </Field>
                                )}
                            />

                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2">
                                        <FieldLabel
                                            htmlFor="change-pw-confirm"
                                            className="text-label-s"
                                        >
                                            Confirm new password
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="change-pw-confirm"
                                            type="password"
                                            autoComplete="new-password"
                                            aria-invalid={fieldState.invalid}
                                            disabled={isSubmitting}
                                            className="text-body-s h-11"
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
                                {isSubmitting ? 'Updating...' : 'Change password'}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
