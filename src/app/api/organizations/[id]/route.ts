import { type NextRequest } from 'next/server';
import OrganizationService from '@/lib/services/organization.service';
import { updateOrganizationSchema } from '@/lib/schemas/organization.schema';
import { handleError } from '@/lib/utils/errors.utils';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const orgId = (await params).id;
        const result = await OrganizationService.getOrganization(orgId);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const parsed = updateOrganizationSchema.parse(body);
        const orgId = (await params).id;
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
        const orgId = (await params).id;
        const result = await OrganizationService.deleteOrganization(orgId);
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
