import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

export type LostConnectionModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function LostConnectionModal({ open, onOpenChange }: LostConnectionModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="h-[180px] w-[340px] gap-4" showCloseButton={false}>
                <VisuallyHidden>
                    <DialogTitle>Network Disconnected</DialogTitle>
                </VisuallyHidden>
                <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                    <p className="text-md font-semibold tracking-wide">
                        You have been disconnected
                    </p>
                    <p className="text-sm">
                        Please check your internet connection. Do not reload the page when trying to
                        reconnect.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
