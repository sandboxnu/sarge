'use client';

import { Button } from '@/lib/components/Button';
import { Dialog, DialogHeader, DialogContent } from '@/lib/components/Modal';

interface WelcomeModalProps {
    setJoinOrganization: React.Dispatch<React.SetStateAction<boolean>>;
    setCreateOrganization: React.Dispatch<React.SetStateAction<boolean>>;
    setCreateOrJoinOrganization: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WelcomeModal({ setJoinOrganization, setCreateOrganization, setCreateOrJoinOrganization }: WelcomeModalProps) {
    return (
<Dialog open={true}>
  <DialogHeader className="sr-only">Modal</DialogHeader>
  <DialogContent
    className="flex h-[292px] w-[544px] flex-col items-center justify-center text-center py-[60px] px-[36px] bg-white shadow-md"
    showCloseButton={false}
  >
    <div className="flex flex-col items-center gap-[12px] not-prose">
      <h2 className="m-0 text-[20px] font-bold leading-[28px] tracking-[0.406px]">
        Welcome!
      </h2>
      <p className="m-0 text-[14px] font-normal leading-[18px] tracking-[0.406px] max-w-[472px]">
        Get started by creating or joining an organization. You&apos;ll be able to
        manage tasks, assessments, and candidates all in one place.
      </p>
    </div>
    <div className="mt-[24px] flex w-[415px] flex-col">
      <Button
        className="h-[36px] px-[16px] py-[8px] flex justify-center items-center gap-[10px] self-stretch"
        size="default"
        variant="primary"
        onClick={() => setCreateOrganization(true)}
      >
        Create organization
      </Button>
      <Button
        className="mt-[12px] h-[36px] px-[16px] py-[8px] flex justify-center items-center gap-[10px] self-stretch"
        size="default"
        variant="tertiary"
        onClick={() => {
          setJoinOrganization(true);
          setCreateOrJoinOrganization(false);
        }}
      >
        Join organization
      </Button>
    </div>
  </DialogContent>
</Dialog>
    );
}
