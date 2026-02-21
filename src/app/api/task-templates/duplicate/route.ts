import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import TaskTemplateService from '@/lib/services/task-template.service';
import { getSession } from '@/lib/utils/auth.utils';

export async function GET(request: NextRequest) {
    try {
        const session = await getSession();
        const searchParams = request.nextUrl.searchParams;

        if (searchParams.has('name')) {
            const titleToCheck = searchParams.get('name') as string;
            const result = await TaskTemplateService.getDuplicateTitle(
                titleToCheck,
                session.activeOrganizationId
            );

            return Response.json({ data: result }, { status: 200 });
        } else {
            return Response.json(
                {
                    message: 'Did not provide "name" route parameter.',
                    data: null,
                },
                { status: 400 }
            );
        }
    } catch (err) {
        return handleError(err);
    }
}
