import CandidateService from '@/lib/services/candidate.service';
import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import { createCandidateSchema } from '@/lib/schemas/candidate.schema';
import { getSession } from '@/lib/utils/auth.utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        const body = await request.json();
        const parsed = createCandidateSchema.parse(body);
        const result = await CandidateService.createCandidate(parsed, session.activeOrganizationId);
        return Response.json({ data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
