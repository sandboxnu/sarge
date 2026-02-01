import { type NextRequest } from 'next/server';
import { handleError } from '@/lib/utils/errors.utils';
import TaskTemplateService from '@/lib/services/task-template.service';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const taskTemplateId = (await params).id;
        const taskTemplatePreview =
            await TaskTemplateService.getTaskTemplateForPreview(taskTemplateId);
        return Response.json({ data: taskTemplatePreview }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
