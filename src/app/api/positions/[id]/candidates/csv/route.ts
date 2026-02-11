import { type NextRequest } from 'next/server';
import { handleError, BadRequestException, ForbiddenException } from '@/lib/utils/errors.utils';
import { parseCandidateCsv } from '@/lib/utils/csv.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { isRecruiterOrAbove } from '@/lib/utils/role.utils';

export async function POST(request: NextRequest) {
    try {
        const session = await getSession();
        if (!isRecruiterOrAbove(session.role)) {
            throw new ForbiddenException('Recruiter role or above required');
        }
        const formData = await request.formData();
        const file = formData.get('file');

        if (!(file instanceof File)) {
            throw new BadRequestException('CSV file is required.');
        }

        const filename = file.name?.toLowerCase() ?? '';
        const mimeType = file.type?.toLowerCase() ?? '';

        if (!(filename.endsWith('.csv') || mimeType.includes('csv'))) {
            throw new BadRequestException('File must be a CSV.');
        }

        const text = await file.text();
        const candidates = parseCandidateCsv(text);

        return Response.json({ data: candidates }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
