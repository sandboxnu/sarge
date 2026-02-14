import { type NextRequest } from 'next/server';
import OrganizationService from '@/lib/services/organization.service';
import { updateOrganizationSchema } from '@/lib/schemas/organization.schema';
import { ForbiddenException, handleError } from '@/lib/utils/errors.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        const orgId = (await params).id;
        if (session.activeOrganizationId !== orgId) {
            throw new ForbiddenException(
                'Active organization ID must match the requested organization ID'
            );
        }
        const result = await OrganizationService.getOrganization(orgId);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(request.headers);
        const body = await request.json();
        const parsed = updateOrganizationSchema.parse(body);
        const orgId = (await params).id;
        if (session.activeOrganizationId !== orgId) {
            throw new ForbiddenException(
                'Active organization ID must match the requested organization ID'
            );
        }
        const result = await OrganizationService.updateOrganization(orgId, parsed);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getSession();
        await assertRecruiterOrAbove(_request.headers);
        const orgId = (await params).id;
        if (session.activeOrganizationId !== orgId) {
            throw new ForbiddenException(
                'Active organization ID must match the requested organization ID'
            );
        }
        const result = await OrganizationService.deleteOrganization(orgId);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
