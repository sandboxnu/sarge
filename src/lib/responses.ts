/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

type ApiResponse<T = any> = {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        details?: any;
    };
    meta?: {
        timestamp: string;
        [key: string]: any;
    };
};

export function sargeApiResponse<T>(
    data: T,
    status: number,
    meta?: any
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
    details?: any
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
