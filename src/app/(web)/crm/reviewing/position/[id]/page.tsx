'use client';
import { use } from 'react';

export default function ReviewPosition({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    // TODO(laith): position-level reviewing view
    return <div>{id}</div>;
}
