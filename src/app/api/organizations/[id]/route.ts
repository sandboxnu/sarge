import { type NextRequest } from 'next/server';
import { OrganizationController } from '@/lib/controllers/organization.controller';
import { sargeApiError, sargeApiResponse } from '@/lib/responses';
import { OrganizationNotFoundError } from '@/lib/schemas/organization.schema';

const organizationController = new OrganizationController();

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const orgId = (await params).id;
        const org = await organizationController.get(orgId);
        return sargeApiResponse(org, 200);
    } catch (error) {
        if (error instanceof OrganizationNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const body = await request.json();
        const orgId = (await params).id;
        const org = await organizationController.update(orgId, body);
        return sargeApiResponse(org, 200);
    } catch (error) {
        if (error instanceof OrganizationNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const orgId = (await params).id;
        const org = await organizationController.delete(orgId);
        return sargeApiResponse(org, 200);
    } catch (error) {
        if (error instanceof OrganizationNotFoundError) {
            return sargeApiError(error.message, 404);
        }

        const message = error instanceof Error ? error.message : String(error);
        return sargeApiError(message, 500);
    }
}