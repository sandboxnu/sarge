'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import useFileUpload from '@/lib/hooks/useFileUpload';
import useFileClient from '@/lib/hooks/useFileClient';
import { authClient } from '@/lib/auth/auth-client';

type OrgLogoUploaderProps = {
    organization: { id: string; name: string; logo: string | null };
    onUpdated: () => void;
};

export default function OrgLogoUploader({ organization, onUpdated }: OrgLogoUploaderProps) {
    const {
        file,
        preview,
        fileInputRef,
        handleFileChange,
        handleProfileImageClick: openFilePicker,
    } = useFileClient();
    const { uploadFile } = useFileUpload('organization');
    const [isUploading, setIsUploading] = useState(false);

    const orgInitial = organization.name?.[0]?.toUpperCase() ?? '?';
    const logoSrc = preview || organization.logo;

    useEffect(() => {
        if (!file) return;
        const upload = async () => {
            setIsUploading(true);
            try {
                const url = await uploadFile(file, organization.id);
                if (!url) {
                    toast.error('Failed to upload logo');
                    return;
                }
                await authClient.organization.update({
                    data: { logo: url },
                    organizationId: organization.id,
                });
                toast.success('Logo updated');
                onUpdated();
            } catch (err) {
                toast.error(
                    `Failed to update logo: ${err instanceof Error ? err.message : 'Unknown error'}`
                );
            } finally {
                setIsUploading(false);
            }
        };
        upload();
    }, [file, organization.id, uploadFile, onUpdated]);

    return (
        <div>
            <button
                type="button"
                onClick={openFilePicker}
                disabled={isUploading}
                className="group bg-sarge-gray-500 text-sarge-gray-0 relative flex size-18 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg disabled:cursor-not-allowed"
            >
                {logoSrc ? (
                    <Image
                        src={logoSrc}
                        alt={`${organization.name} logo`}
                        fill
                        sizes="72px"
                        className="object-cover"
                    />
                ) : (
                    <span className="text-display-xs text-sarge-gray-0 font-semibold">
                        {orgInitial}
                    </span>
                )}
                {!isUploading && (
                    <span
                        className="bg-sarge-gray-900/50 absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                        aria-hidden
                    >
                        <Upload className="text-sarge-gray-0 size-6" strokeWidth={1.5} />
                    </span>
                )}
                {isUploading && (
                    <span className="bg-sarge-gray-800/40 absolute inset-0 flex items-center justify-center">
                        <Loader2 className="text-sarge-gray-0 size-6 animate-spin" />
                    </span>
                )}
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
