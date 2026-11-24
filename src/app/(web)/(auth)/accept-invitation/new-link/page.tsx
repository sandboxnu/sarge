'use client';

import { use, useEffect, useRef } from 'react';
import { Heading } from '@/lib/components/core/AcceptInvitation';
import { requestNewInvitationLink } from '@/lib/api/organizations';

// POST from the page, not on GET, so mail scanners opening the link don't send emails
export default function NewInvitationLinkPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = use(searchParams);
    const sent = useRef(false);

    useEffect(() => {
        if (!id || sent.current) return;
        sent.current = true;
        requestNewInvitationLink(id);
    }, [id]);

    return id ? (
        <Heading title="A new link has been sent to your email">
            If this invitation is still open, check your inbox for a fresh link and code. They
            expire in 24 hours.
        </Heading>
    ) : (
        <Heading title="Link is invalid">
            This link is missing information. Check the link in your email and try again.
        </Heading>
    );
}
