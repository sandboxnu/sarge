'use client';

import { Dialog, DialogContent, DialogTitle } from '@/lib/components/modal/Modal';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { type RefObject } from 'react';
import { Button } from '@/lib/components/Button';
import Image from 'next/image';
import { SquarePen } from 'lucide-react';
import useOnboardingModal from '@/lib/hooks/useOnboardingModal';

export default function OnboardingModal() {
    const {
        open,
        step,
        goTo,
        onOpenChange,

        organizationName,
        setOrganizationName,
        createOrganization,
        loading,

        preview,
        fileInputRef,
        handleFileChange,
        handleProfileImageClick,
    } = useOnboardingModal();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden>
                {/* Need to hide the title due to this modal having multiple states */}
                <DialogTitle>Onboarding</DialogTitle>
            </VisuallyHidden>

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
                        onBack={() => goTo('welcome')}
                        onSubmit={createOrganization}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

function WelcomeContent({ onCreate }: { onCreate: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <h2 className="mb-3 text-center text-xl font-bold">Welcome!</h2>
            <p className="text-sm leading-5 font-normal tracking-normal">
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
                    className="bg-sarge-gray-200 flex h-[65px] w-[65px] items-center justify-center overflow-hidden rounded-md hover:cursor-pointer hover:ring-2 hover:ring-black/40"
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
        <div className="flex flex-col items-center justify-center gap-1 self-stretch">
            <Image src="/CreateOrgLoading.gif" alt="Loading GIF" width={66} height={66} />

            <p className="text-sarge-gray-800 text-base leading-tight font-medium tracking-wide">
                Creating organization...
            </p>
        </div>
    );
}
