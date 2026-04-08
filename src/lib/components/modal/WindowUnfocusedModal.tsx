import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export type WindowUnfocusedModalProps = {
    open: boolean;
    onAcknowledge: () => void;
};

export function WindowUnfocusedModal({ open, onAcknowledge }: WindowUnfocusedModalProps) {
    return (
        <Dialog open={open} onOpenChange={() => {}}>
            <DialogContent
                className="w-[380px] gap-4"
                showCloseButton={false}
                overlayClassName="backdrop-blur-md"
            >
                <VisuallyHidden>
                    <DialogTitle>Window Unfocused</DialogTitle>
                </VisuallyHidden>
                <div className="flex flex-col items-center justify-center gap-4 px-2 text-center">
                    <p className="text-md font-semibold tracking-wide">
                        You can&apos;t unfocus your assessment window during the exam
                    </p>
                    <Button className="h-9 min-w-28 px-5" type="button" onClick={onAcknowledge}>
                        I understand
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
