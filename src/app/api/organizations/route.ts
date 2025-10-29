import OrganizationService from '@/lib/services/organization.service';
import { type NextRequest } from 'next/server';
import { badRequest, error, handleError, success } from '@/lib/responses';
import { createOrganizationSchema } from '@/lib/schemas/organization.schema';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = createOrganizationSchema.safeParse(body);
        if (!parsed.success) return badRequest('Invalid organization data', parsed.error);

        const result = await OrganizationService.createOrganization(parsed.data);
        if (!result.success) return error(result.message, result.status);
        return success(result.data, 201);
    } catch (err) {
        return handleError(err);
    }
}
