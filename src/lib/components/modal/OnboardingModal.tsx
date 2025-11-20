'use client';

import { Dialog, DialogContent, DialogTitle } from '@/lib/components/modal/Modal';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { type RefObject } from 'react';
import { Button } from '@/lib/components/Button';
import Image from 'next/image';
import { SquarePen } from 'lucide-react';

type OnboardingStep = 'welcome' | 'create' | 'join' | null;

interface OnboardingModalProps {
    open: boolean;
    onOpenChange: (o: boolean) => void;
    step: OnboardingStep;
    goTo: (step: OnboardingStep) => void;
    fileInputRef: RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleProfileImageClick: () => void;
    preview: string;
    setOrganizationName: React.Dispatch<React.SetStateAction<string>>;
    organizationName: string;
    loading: boolean;
    error: string | null;
    onCreateSubmit: () => Promise<void> | void;
}

export default function OnboardingModal({
    open,
    onOpenChange,
    step,
    goTo,
    fileInputRef,
    handleFileChange,
    handleProfileImageClick,
    preview,
    setOrganizationName,
    organizationName,
    loading,
    error,
    onCreateSubmit,
}: OnboardingModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden>
                <DialogTitle>Onboarding</DialogTitle>
            </VisuallyHidden>

            {/* You can vary size based on step if you want */}
            <DialogContent
                className="h-[292px] w-[544px]"
                showCloseButton={false}
                onInteractOutside={(event) => {
                    event.preventDefault();
                }}
            >
                {step === 'welcome' && <WelcomeContent onCreate={() => goTo('create')} />}

                {step === 'create' && (
                    <CreateOrganizationContent
                        fileInputRef={fileInputRef}
                        handleFileChange={handleFileChange}
                        handleProfileImageClick={handleProfileImageClick}
                        preview={preview}
                        setOrganizationName={setOrganizationName}
                        organizationName={organizationName}
                        loading={loading}
                        error={error}
                        onBack={() => goTo('welcome')}
                        onSubmit={onCreateSubmit}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

function WelcomeContent({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <h2 className="mb-[12px] text-center text-xl font-bold text-black">Welcome!</h2>
            <p className="text-[14px] leading-[18px] font-normal tracking-[0.406px] not-italic">
                Get started by creating or joining an organization. You&apos;ll be able to manage
                tasks, assessments, and candidates all in one place.
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
                <Button className="flex w-106 justify-center" size="default" variant="tertiary">
                    Join Organization
                </Button>
            </div>
        </div>
    );
}

function CreateOrganizationContent({
    fileInputRef,
    handleFileChange,
    handleProfileImageClick,
    preview,
    setOrganizationName,
    organizationName,
    loading,
    // error,
    onBack,
    onSubmit,
}: {
    fileInputRef: RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleProfileImageClick: () => void;
    preview: string;
    setOrganizationName: React.Dispatch<React.SetStateAction<string>>;
    organizationName: string;
    loading: boolean;
    error: string | null;
    onBack: () => void;
    onSubmit: () => Promise<void> | void;
}) {
    if (loading) return <LoadingContent />;

    return (
        <div className="flex flex-col justify-center">
            <input
                type="file"
                accept="image/png, image/jpeg"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
            <h1 className="font-bold">Create an organization</h1>

            <div className="mt-4 mb-2 flex w-full content-center justify-center">
                <div
                    className="bg-sarge-gray-200 flex h-[65px] w-[65px] items-center justify-center overflow-hidden rounded-full hover:cursor-pointer"
                    onClick={handleProfileImageClick}
                >
                    {preview ? (
                        <Image
                            src={preview}
                            width={65}
                            height={65}
                            alt="Profile"
                            className="h-full w-full object-cover object-center"
                        />
                    ) : (
                        <SquarePen className="text-sarge-gray-500" />
                    )}
                </div>
            </div>

            <div className="pt-2 pb-1 font-bold">Organization name</div>
            <input
                type="text"
                name="Enter a name for your organization"
                id="Name"
                className="bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 border-sarge-gray-200 h-[44px] rounded-lg border px-3 py-1"
                placeholder="Enter a name for your organization"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
            />

            {/* Error state will come in toasts */}
            {/* {error && ( */}
            {/*     <p className="mt-2 text-sm text-red-500"> */}
            {/*         {error} */}
            {/*     </p> */}
            {/* )} */}

            <div className="mt-4 flex items-center justify-between">
                <p
                    className="text-sarge-primary-500 hover:text-sarge-primary-600 hover:cursor-pointer"
                    onClick={onBack}
                >
                    Back
                </p>
                <Button
                    variant="primary"
                    size="default"
                    className="w-[125px]"
                    onClick={onSubmit}
                    disabled={loading}
                >
                    Continue
                </Button>
            </div>
        </div>
    );
}

function LoadingContent() {
    return (
        <div className="flex flex-col items-center justify-center gap-[4px] self-stretch">
            <Image src="/CreateOrgLoading.gif" alt="Loading GIF" width={66} height={66} />

            <p className="text-sarge-gray-800 leading-[18px] font-medium tracking-[0.406px]">
                Creating organization...
            </p>
        </div>
    );
}
