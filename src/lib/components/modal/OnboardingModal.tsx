'use client';

import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { type RefObject } from 'react';
import { Button } from '@/lib/components/ui/Button';
import Image from 'next/image';
import { AlertCircle } from 'lucide-react';
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
        error,

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
                className="h-onboarding-modal-height w-onboarding-modal-width"
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
            <div className="mt-[24px] flex w-[415px] flex-col gap-2">
                <Button
                    className="flex h-[36px] w-full justify-center px-4 py-2"
                    size="default"
                    variant="primary"
                    onClick={onCreate}
                >
                    Create Organization
                </Button>
                <Button
                    className="flex h-[36px] w-full justify-center px-4 py-2"
                    size="default"
                    variant="tertiary"
                >
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
    error,
    loading,
    onBack,
    onSubmit,
}: {
    fileInputRef: RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleProfileImageClick: () => void;
    preview: string;
    // https://stackoverflow.com/questions/72451220/how-to-set-props-type-of-a-usestate-function
    setOrganizationName: React.Dispatch<React.SetStateAction<string>>;
    organizationName: string;
    error: string | null;
    loading: boolean;
    onBack: () => void;
    onSubmit: () => Promise<string | undefined> | void;
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
                    className="group flex h-[65px] w-[65px] items-center justify-center overflow-hidden rounded-md bg-sarge-gray-200 hover:cursor-pointer hover:ring-2 hover:ring-black/40"
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
                        <div className="relative h-full w-full">
                            <Image
                                src="/CreateOrgIcon.svg"
                                width={65}
                                height={65}
                                alt="Create organization"
                                className="absolute inset-0 h-full w-full object-contain opacity-100 transition-opacity duration-150 group-hover:opacity-0"
                            />
                            <Image
                                src="/CreateOrgHoverIcon.svg"
                                width={65}
                                height={65}
                                alt="Create organization"
                                className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="font-medium">Organization name</div>
                <input
                    type="text"
                    name="Enter a name for your organization"
                    id="Name"
                    className="h-[44px] rounded-md border border-sarge-gray-200 bg-sarge-gray-50 px-3 py-1 text-sarge-gray-800 placeholder:text-sarge-gray-500"
                    placeholder="Enter a name for your organization"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                />
            </div>
            {error && (
                <div className="text-body-s mt-2 flex items-center gap-2 text-sarge-error-700">
                    <AlertCircle className="size-4" />
                    {error}
                </div>
            )}

            <div className="mt-4 flex items-center justify-between">
                <p
                    className="text-sarge-primary-500 hover:cursor-pointer hover:text-sarge-primary-600"
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

            <p className="text-base leading-tight font-medium tracking-wide text-sarge-gray-800">
                Creating organization...
            </p>
        </div>
    );
}
