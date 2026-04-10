import { Button } from '@/lib/components/ui/Button';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type WindowUnfocusedModalProps = {
    open: boolean;
    onAcknowledge: () => void;
};

export function WindowUnfocusedModal({ open, onAcknowledge }: WindowUnfocusedModalProps) {
    return (
        <Dialog open={open} onOpenChange={() => { }}>
            <DialogContent
                className="h-[184px] w-[361px] gap-4"
                backgroundClassName="bg-white/25 backdrop-blur-md"
                showCloseButton={false}
            >
                <VisuallyHidden>
                    <DialogTitle>Window Unfocused</DialogTitle>
                </VisuallyHidden>
                <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                    <div className="space-y-1">
                        <p className="text-md font-semibold tracking-wide">
                            You can&apos;t unfocus your window during the exam
                        </p>
                        <p className="text-sm">The admin has been notified.</p>
                    </div>
                    <Button className="h-9 min-w-28 px-5" onClick={onAcknowledge}>
                        I understand
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
