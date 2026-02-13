import React, { Suspense } from 'react';
import AcceptInvitation from './acceptInventation';

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AcceptInvitation />
        </Suspense>
    );
}
