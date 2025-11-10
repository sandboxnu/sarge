'use client';

import { Button } from '@/lib/components/Button';
import { Dialog, DialogHeader, DialogContent } from '@/lib/components/Modal';

interface WelcomeModalProps {
    setJoinOrganization: React.Dispatch<React.SetStateAction<boolean>>;
    setCreateOrganization: React.Dispatch<React.SetStateAction<boolean>>;
    setCreateOrJoinOrganization: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function WelcomeModal({
    setJoinOrganization,
    setCreateOrganization,
    setCreateOrJoinOrganization,
}: WelcomeModalProps) {
    return (
        <Dialog open={true}>
            <DialogHeader className="sr-only">Modal</DialogHeader>
            <DialogContent
                className="flex h-[292px] w-[544px] flex-col items-center justify-center bg-white px-[36px] py-[60px] text-center shadow-md"
                showCloseButton={false}
            >
                <div className="not-prose flex flex-col items-center gap-[12px]">
                    <h2 className="m-0 text-[20px] leading-[28px] font-bold tracking-[0.406px]">
                        Welcome!
                    </h2>
                    <p className="m-0 max-w-[472px] text-[14px] leading-[18px] font-normal tracking-[0.406px]">
                        Get started by creating or joining an organization. You&apos;ll be able to
                        manage tasks, assessments, and candidates all in one place.
                    </p>
                </div>
                <div className="mt-[24px] flex w-[415px] flex-col">
                    <Button
                        className="flex h-[36px] items-center justify-center gap-[10px] self-stretch px-[16px] py-[8px]"
                        size="default"
                        variant="primary"
                        onClick={() => setCreateOrganization(true)}
                    >
                        Create organization
                    </Button>
                    <Button
                        className="mt-[12px] flex h-[36px] items-center justify-center gap-[10px] self-stretch px-[16px] py-[8px]"
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
