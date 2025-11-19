'use client';

import { Button } from '@/lib/components/Button';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/modal/Modal';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface WelcomeModalProps {
    open: boolean;
    onOpenChange: (o: boolean) => void;
    onCreate: () => void;
    onJoin: () => void;
}

export default function WelcomeModal({ open, onOpenChange, onCreate, onJoin }: WelcomeModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden>
                <DialogTitle>Welcome Modal</DialogTitle>
            </VisuallyHidden>
            <DialogContent showCloseButton={false} className="h-[292px] w-[544px]">
                <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="mb-[12px] text-center text-xl font-bold text-black">Welcome!</h2>
                    <p className="text-[14px] leading-[18px] font-normal tracking-[0.406px] not-italic">
                        Get started by creating or joining an organization. You&apos;ll be able to
                        manage tasks, assessments, and candidates all in one place.
                    </p>
                    <div className="mt-[24px] h-[72px] w-[415px]">
                        <Button
                            className="flex w-106 justify-center"
                            size="default"
                            variant="primary"
                            onClick={onCreate}
                        >
                            Create Organization
                        </Button>
                        <Button
                            className="flex w-106 justify-center"
                            size="default"
                            variant="tertiary"
                            onClick={onJoin}
                        >
                            Join Organization
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
