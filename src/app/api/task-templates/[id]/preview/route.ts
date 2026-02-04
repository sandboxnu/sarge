import { handleError } from '@/lib/utils/errors.utils';
import TaskTemplateService from '@/lib/services/task-template.service';
import { type NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const taskTemplatePreview = await TaskTemplateService.getTaskTemplateForPreview(id);
        return Response.json({ data: taskTemplatePreview }, { status: 200 });
    } catch (err) {
        return handleError(err);
    }
}
