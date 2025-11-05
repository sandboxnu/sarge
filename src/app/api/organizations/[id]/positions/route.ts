import { type NextRequest } from 'next/server';
import PositionService from '@/lib/services/position.service';
import { handleError, notFound } from '@/lib/responses';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const orgId = (await params).id;
        const org = await prisma.organization.findUnique({
                where: {
                    id: orgId,
                }
            });
        if (!org) {
            return Response.json(notFound('Organization', orgId));
        }
        const positionsResult = await PositionService.getPositionByOrgId(orgId);
        return Response.json(positionsResult)
    } catch (err) {
        return handleError(err);
    }
}
