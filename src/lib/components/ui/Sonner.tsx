'use client';

import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
} from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

export function Toaster(props: ToasterProps) {
    return (
        <Sonner
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="text-success-icon size-5" />,
                info: <InfoIcon className="text-info-icon size-5" />,
                warning: <TriangleAlertIcon className="text-warning-icon size-5" />,
                error: <OctagonXIcon className="text-error-icon size-5" />,
                loading: <Loader2Icon className="text-loading-icon size-5 animate-spin" />,
            }}
            toastOptions={{
                classNames: {
                    toast: 'rounded-lg px-3 py-2',

                    success:
                        '!bg-sarge-success-500 !text-sarge-gray-50 !border !border-sarge-success-500',
                    error: '!bg-sarge-error-400 !text-sarge-gray-50 !border !border-sarge-error-400',
                    warning:
                        '!bg-sarge-warning-400 !text-sarge-gray-800 !border !border-sarge-warning-400',
                    info: '!bg-sarge-gray-200 !text-sarge-gray-800 !border !border-sarge-gray-200',
                    loading:
                        '!bg-sarge-gray-200 !text-sarge-gray-800 !border !border-sarge-gray-200',
                },
            }}
            {...props}
        />
    );
}
