import OrganizationService from '@/lib/services/organization.service';
import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import { createOrganizationSchema } from '@/lib/schemas/organization.schema';
import { getSession } from '@/lib/utils/auth.utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();

        const body = await request.json();
        const createOrgRequest = createOrganizationSchema.parse(body);
        const organization = await OrganizationService.createOrganization(
            createOrgRequest,
            session.userId,
            session.headers
        );
        return Response.json({ data: organization }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
