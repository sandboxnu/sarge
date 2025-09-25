/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

type ApiResponse<T = unknown> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: unknown;
    };
    meta?: {
        timestamp: string;
        [key: string]: unknown;
    };
};

export function sargeApiResponse<T>(
    data: T,
    status: number,
    meta?: Record<string, unknown>
): NextResponse<ApiResponse<T>> {
    return NextResponse.json(
        {
            success: true,
            data,
            error: undefined,
            meta: {
                timestamp: new Date().toISOString(),
                ...meta,
            },
        },
        { status }
    );
}

export function sargeApiError(
    message: string,
    status: number,
    details?: unknown
): NextResponse<ApiResponse> {
    return NextResponse.json(
        {
            success: false,
            data: null,
            error: {
                message,
                details,
            },
            meta: {
                timestamp: new Date().toISOString(),
            },
        },
        { status }
    );
}
