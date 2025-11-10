import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/lib/components/Modal"
import { SquarePen } from 'lucide-react';
import { Button } from '@/lib/components/Button';
import Image from "next/image";
import { type RefObject } from "react";

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
            <DialogHeader className='sr-only'>Modal</DialogHeader>
            <DialogContent className="sm:max-w-[425px]" showCloseButton={false}>
                <div className='flex flex-col justify-center'>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <h1 className='font-bold'>Create an organization</h1>
                    <div className='flex mt-4 mb-2 content-center justify-center w-full'>
                        <div
                            className="w-[65px] h-[65px] rounded-full overflow-hidden bg-sarge-gray-200 flex items-center justify-center hover:cursor-pointer"
                            onClick={handleProfileImageClick}
                        >
                            {preview ? (
                                <Image
                                    src={preview}
                                    width={65}
                                    height={65}
                                    alt="Profile"
                                    className="w-full h-full object-cover object-center"
                                />
                            ) : (
                                <SquarePen className="text-sarge-gray-500" />
                            )}
                        </div>
                    </div>
                    <div className='pt-2 pb-1 font-bold'>Organization name</div>
                    <input
                        type="text"
                        name="Enter a name for your organization"
                        id="Name"
                        className={`bg-sarge-gray-50 text-sarge-gray-800 placeholder:text-sarge-gray-500 border-sarge-gray-200 rounded-lg border px-3 py-1 h-[44px]`}
                        placeholder="Enter a name for your organization"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                    />
                    <div className='justify-between flex mt-4 items-center'>
                        <p className='text-sarge-primary-700 hover:cursor-pointer' onClick={onBack}>Back</p>
                        <Button variant='primary' size='default' className='w-[125px]' onClick={onSubmit}>Continue</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
