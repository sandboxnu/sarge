import { type NextRequest } from 'next/server';
import OrganizationService from '@/lib/services/organization.service';
import { badRequest, error, handleError, success } from '@/lib/responses';
import { updateOrganizationSchema } from '@/lib/schemas/organization.schema';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const orgId = (await params).id;
        const result = await OrganizationService.getOrganization(orgId);
        if (!result.success) return error(result.message, result.status);
        return success(result.data, 200);
    } catch (err) {
        return handleError(err);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const parsed = updateOrganizationSchema.safeParse(body);
        if (!parsed.success) return badRequest('Invalid organization data', parsed.error);

        const orgId = (await params).id;
        const result = await OrganizationService.updateOrganization(orgId, parsed.data);
        if (!result.success) return error(result.message, result.status);
        return success(result.data, 200);
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
        if (!result.success) return error(result.message, result.status);
        return success(result.data, 200);
    } catch (err) {
        return handleError(err);
    }
}
