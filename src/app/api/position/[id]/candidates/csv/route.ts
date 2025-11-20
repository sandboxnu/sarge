import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';
import { handleError, BadRequestException } from '@/lib/utils/errors.utils';
import { parseCandidateCsv } from '@/lib/utils/csv.utils';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!(file instanceof File)) {
            throw new BadRequestException('CSV file is required.');
        }

        const text = await file.text();
        const candidates = parseCandidateCsv(text);

        return Response.json({ data: candidates }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
