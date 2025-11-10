import { Dialog, DialogContent, DialogHeader } from '@/lib/components/Modal';
import { SquarePen } from 'lucide-react';
import { Button } from '@/lib/components/Button';
import Image from 'next/image';
import { type RefObject } from 'react';

interface CreateOrganizationModalParams {
    fileInputRef: RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleProfileImageClick: () => void;
    preview: string;
    setOrganizationName: React.Dispatch<React.SetStateAction<string>>;
    setCreateOrJoinOrganization: React.Dispatch<React.SetStateAction<boolean>>;
    setCreateOrganization: React.Dispatch<React.SetStateAction<boolean>>;
    submitOrganization: () => void;
}

export function CreateOrganizationModal({
    fileInputRef,
    handleFileChange,
    handleProfileImageClick,
    preview,
    setOrganizationName,
    setCreateOrJoinOrganization,
    submitOrganization,
    setCreateOrganization,
}: CreateOrganizationModalParams) {
    return (
        <Dialog open={true}>
            <DialogHeader className="sr-only">Modal</DialogHeader>
            <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
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
                            className="inline-flex h-[292px] w-[544px] flex-col items-start justify-center gap-[10px] rounded-2xl bg-white px-[36px] py-[60px] shadow-md"
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
                        onChange={(e) => setOrganizationName(e.target.value)}
                    />
                    <div className="mt-4 flex items-center justify-between">
                        <p
                            className="text-sarge-primary-700 hover:cursor-pointer"
                            onClick={() => {
                                setCreateOrJoinOrganization(true);
                                setCreateOrganization(false);
                            }}
                        >
                            Back
                        </p>
                        <Button
                            variant="primary"
                            size="default"
                            className="w-[125px]"
                            onClick={() => submitOrganization()}
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
