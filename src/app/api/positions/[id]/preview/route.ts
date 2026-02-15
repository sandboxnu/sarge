import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import PositionService from '@/lib/services/position.service';
import { handleError } from '@/lib/utils/errors.utils';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await getSession();

        const positionId = (await params).id;
        const position = await PositionService.getPositionPreview(
            positionId,
            session.activeOrganizationId
        );

        const serialized = {
            ...position,
            createdAt: position.createdAt.toISOString(),
            candidates: position.candidates.map((c) => ({
                ...c,
                candidate: {
                    ...c.candidate,
                    graduationDate: c.candidate.graduationDate ?? 'N/A',
                    major: c.candidate.major ?? 'N/A',
                },
                assessment: c.assessment
                    ? {
                          ...c.assessment,
                          submittedAt: c.assessment.submittedAt?.toISOString() ?? null,
                      }
                    : null,
            })),
        };

        return Response.json({ data: serialized }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
