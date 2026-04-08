import { Dialog, DialogOverlay, DialogPortal, DialogTitle } from '@/lib/components/ui/Modal';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export type WindowUnfocusedModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function WindowUnfocusedModal({ open, onOpenChange }: WindowUnfocusedModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="backdrop-blur-md" />
                <DialogPrimitive.Content className="bg-background border-sarge-gray-200 fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg">
                    <VisuallyHidden>
                        <DialogTitle>Window Unfocused</DialogTitle>
                    </VisuallyHidden>
                    <div className="flex flex-col items-center justify-center gap-2 px-6 text-center">
                        <p className="text-md font-semibold tracking-wide">
                            You can&apos;t unfocus your assessment window during the exam
                        </p>
                    </div>
                </DialogPrimitive.Content>
            </DialogPortal>
        </Dialog>
    );
}
