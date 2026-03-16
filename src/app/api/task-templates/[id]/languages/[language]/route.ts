import { handleError } from '@/lib/utils/errors.utils';
import TaskTemplateService from '@/lib/services/task-template.service';
import { type NextRequest } from 'next/server';
import { getSession } from '@/lib/utils/auth.utils';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string; language: string }> }
) {
    try {
        const session = await getSession();
        const { id, language } = await params;
        const result = await TaskTemplateService.getTaskTemplateLanguage(
            id,
            language,
            session.activeOrganizationId
        );
        return Response.json({ data: result }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
