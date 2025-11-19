import { useEffect, useRef, useState } from 'react';

export function useAvatarUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (preview) URL.revokeObjectURL(preview);

    const nextFile = e.target.files?.[0];
    if (!nextFile) return;

    const url = URL.createObjectURL(nextFile);
    setFile(nextFile);
    setPreview(url);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current?.click();
  };

  return {
    file,
    preview,
    fileInputRef,
    handleFileChange,
    handleProfileImageClick,
  };
}
