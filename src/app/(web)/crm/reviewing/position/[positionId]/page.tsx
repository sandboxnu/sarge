'use client';
import { use } from 'react';

export default function ReviewPosition({ params }: { params: Promise<{ positionId: string }> }) {
    const { positionId } = use(params);

    // TODO(laith): position-level reviewing view
    return <div>{positionId}</div>;
}
