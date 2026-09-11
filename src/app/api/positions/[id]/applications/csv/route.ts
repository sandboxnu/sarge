import { type NextRequest } from 'next/server';
import { handleError, BadRequestException } from '@/lib/utils/errors.utils';
import { parseCandidateCsv } from '@/lib/utils/csv.utils';
import { getSession } from '@/lib/utils/auth.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';

export async function POST(request: NextRequest) {
    try {
        await getSession();
        await assertRecruiterOrAbove(request.headers);
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
