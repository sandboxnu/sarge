"use client"

import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

export function Toaster(props: ToasterProps) {
    return (
        <Sonner
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-5 text-success-icon" />,
                info: <InfoIcon className="size-5 text-info-icon" />,
                warning: <TriangleAlertIcon className="size-5 text-warning-icon" />,
                error: <OctagonXIcon className="size-5 text-error-icon" />,
                loading: <Loader2Icon className="size-5 animate-spin text-loading-icon" />,
            }}

            toastOptions={{
                classNames: {
                    toast: "rounded-lg px-3 py-2",

                    success:
                        "!bg-sarge-success-500 !text-sarge-gray-50 !border !border-sarge-success-500",
                    error:
                        "!bg-sarge-error-400 !text-sarge-gray-50 !border !border-sarge-error-400",
                    warning:
                        "!bg-sarge-warning-400 !text-sarge-gray-800 !border !border-sarge-warning-400",
                    info:
                        "!bg-sarge-gray-200 !text-sarge-gray-800 !border !border-sarge-gray-200",
                    loading:
                        "!bg-sarge-gray-200 !text-sarge-gray-800 !border !border-sarge-gray-200",
                },
            }}

            {...props}
        />
    )
}
