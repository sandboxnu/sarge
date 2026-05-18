'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import useFileUpload from '@/lib/hooks/useFileUpload';
import useFileClient from '@/lib/hooks/useFileClient';

type UseOrgLogoUploaderArgs = {
    organization: { id: string; name: string; logo: string | null };
    updateLogo: (logoUrl: string) => Promise<boolean>;
    onUpdated: () => void;
};

export default function useOrgLogoUploader({
    organization,
    updateLogo,
    onUpdated,
}: UseOrgLogoUploaderArgs) {
    const {
        file,
        preview,
        fileInputRef,
        handleFileChange,
        handleProfileImageClick: openFilePicker,
    } = useFileClient();
    const { uploadFile } = useFileUpload('organization');
    const [isUploading, setIsUploading] = useState(false);

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
                const ok = await updateLogo(url);
                if (ok) onUpdated();
            } catch (err) {
                toast.error(
                    `Failed to update logo: ${err instanceof Error ? err.message : 'Unknown error'}`
                );
            } finally {
                setIsUploading(false);
            }
        };
        upload();
    }, [file, organization.id, uploadFile, updateLogo, onUpdated]);

    return {
        fileInputRef,
        handleFileChange,
        openFilePicker,
        isUploading,
        logoSrc,
    };
}
