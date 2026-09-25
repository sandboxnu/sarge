'use client';

import { X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/lib/components/ui/Modal';
import { Button } from '@/lib/components/ui/Button';
import { Input } from '@/lib/components/ui/Input';

type RemoveMemberModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    memberName: string;
    submitting: boolean;
    onConfirm: () => void;
}

export default function RemoveMemberModal({
    open,
    onOpenChange,
    memberName,
    submitting,
    onConfirm,
}: RemoveMemberModalProps) {
    
}