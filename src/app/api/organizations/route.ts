import { OrganizationController } from '@/lib/controllers/organization.controller';
import { type NextRequest } from 'next/server';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { InvalidInputError } from '@/lib/schemas/errors';

const organizationController = new OrganizationController();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const org = await organizationController.create(body);
        return sargeApiResponse(org, 200);
    } catch (error) {
        if (error instanceof InvalidInputError) {
            return sargeApiError(error.message, 400);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}


