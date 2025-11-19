import { Dialog, DialogContent, DialogTitle } from '@/lib/components/modal/Modal';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { SquarePen } from 'lucide-react';
import { Button } from '@/lib/components/Button';
import Image from 'next/image';
import { type RefObject } from 'react';

interface CreateOrganizationModalProps {
    open: boolean;
    onOpenChange: (o: boolean) => void;
    onBack: () => void;
    onSubmit: () => Promise<void> | void;
    fileInputRef: RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleProfileImageClick: () => void;
    preview: string;
    setOrganizationName: React.Dispatch<React.SetStateAction<string>>;
    organizationName: string;
    loading: boolean;
    error: string | null;
}

export default function CreateOrganizationModal({
    open,
    onOpenChange,
    onBack,
    onSubmit,
    fileInputRef,
    handleFileChange,
    handleProfileImageClick,
    preview,
    setOrganizationName,
    organizationName,
    loading,
    error,
}: CreateOrganizationModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <VisuallyHidden>
                <DialogTitle>Create Organization</DialogTitle>
            </VisuallyHidden>
            <DialogContent
                className="sm:max-w-[425px]"
                showCloseButton={false}
                onInteractOutside={(event) => {
                    if (loading) event.preventDefault();
                }}
            >
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
                        className={`bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 border-sarge-gray-200 h-[44px] rounded-lg border px-3 py-1`}
                        placeholder="Enter a name for your organization"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                    />
                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-sarge-primary-500 hover:text-sarge-primary-600 hover:cursor-pointer" onClick={onBack}>
                            Back
                        </p>
                        <Button
                            variant="primary"
                            size="default"
                            className="w-[125px]"
                            onClick={onSubmit}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
