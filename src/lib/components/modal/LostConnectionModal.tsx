import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Button } from '@/lib/components/ui/Button';

export type LostConnectionModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LostConnectionModal({ open, onOpenChange }: LostConnectionModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[381px] h-[234px] gap-4" showCloseButton={true}>
                <VisuallyHidden>
                    <DialogTitle>Network Disconnected</DialogTitle>
                </VisuallyHidden>
                <div className='flex flex-col items-center gap-6 text-center'>
                    <p className="text-sarge-gray-800 text-base leading-tight font-medium tracking-wide mt-2">
                        You seem to be having issues with your connection.
                    </p>
                    <p>If you disconnect again during this exam, your current progress will be auto-submitted.</p>
                    <Button className='px-4 py-2'>I understand</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
