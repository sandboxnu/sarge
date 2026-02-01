import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import TaskTemplateService from '@/lib/services/task-template.service';

export async function POST(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const taskTemplateId = (await params).id;
        const duplicatedTaskTemplate =
            await TaskTemplateService.duplicateTaskTemplate(taskTemplateId);
        return Response.json({ data: duplicatedTaskTemplate }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
