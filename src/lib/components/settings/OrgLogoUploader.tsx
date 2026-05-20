'use client';

import Image from 'next/image';
import { Loader2, Upload } from 'lucide-react';
import useOrgLogoUploader from '@/lib/hooks/useOrgLogoUploader';

type OrgLogoUploaderProps = {
    organization: { id: string; name: string; logo: string | null };
    updateLogo: (logoUrl: string) => Promise<boolean>;
    disabled?: boolean;
    onUpdated: () => void;
};

export default function OrgLogoUploader({
    organization,
    updateLogo,
    disabled = false,
    onUpdated,
}: OrgLogoUploaderProps) {
    const { fileInputRef, handleFileChange, openFilePicker, isUploading, logoSrc } =
        useOrgLogoUploader({ organization, updateLogo, onUpdated });

    const orgInitial = organization.name?.[0]?.toUpperCase() ?? '?';

    return (
        <div>
            <button
                type="button"
                onClick={openFilePicker}
                disabled={isUploading || disabled}
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
                    <span className="text-display-xs text-sarge-gray-0">{orgInitial}</span>
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
