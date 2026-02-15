import { Suspense } from 'react';
import AcceptInvitation from './AcceptInvitation';

export default function AcceptInvitationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AcceptInvitation />
        </Suspense>
    );
}
