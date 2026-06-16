import { type NextRequest } from 'next/server';
import AssessmentService from '@/lib/services/assessment.service';
import { handleError, UnauthorizedException } from '@/lib/utils/errors.utils';

export async function POST(request: NextRequest) {
    try {
        const expected = process.env.INTERNAL_API_SECRET;
        const provided = request.headers.get('X-SARGE-INTERNAL-SECRET');
        if (!expected || provided !== expected) {
            throw new UnauthorizedException('Invalid internal secret');
        }

        const expired = await AssessmentService.expireOverdueAssessments();
        return Response.json({ data: { expired } }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
