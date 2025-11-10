'use client';

import { Button } from '@/lib/components/Button';
import { Dialog, DialogHeader, DialogContent } from '@/lib/components/Modal';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface WelcomeModalProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onCreate: () => void;
  onJoin: () => void;
}

export default function WelcomeModal({
  open,
  onOpenChange,
  onCreate,
  onJoin,
}: WelcomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <DialogHeader>Modal</DialogHeader>
      </VisuallyHidden>
      <DialogContent
        showCloseButton={false}
        className='w-[544px] h-[292px]'
      >
        <div className='flex flex-col justify-center items-center text-center'>
          <h2 className="mb-[12px] text-center text-xl font-bold text-black">Welcome!</h2>
          <p className="text-[14px] font-normal leading-[18px] tracking-[0.406px] not-italic">
            Get started by creating or joining an organization. You&apos;ll be able to
            manage tasks, assessments, and candidates all in one place.
          </p>
          <div className="w-[415px] h-[72px] mt-[24px]">
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
