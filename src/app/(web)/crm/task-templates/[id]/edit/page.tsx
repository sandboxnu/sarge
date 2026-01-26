import { getSession } from '@/lib/utils/auth.utils';
import TaskTemplateService from '@/lib/services/task-template.service';
import { TaskEditor } from '@/lib/components/core/task-editor/TaskEditor';
import type { TaskTemplateDetail } from '@/lib/types/task-template.types';

export default async function EditTaskTemplatePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getSession();

    const taskTemplate = await TaskTemplateService.getTaskTemplateDetail(
        id,
        session.activeOrganizationId
    );

    // transforms the prisma model
    const templateDetail: TaskTemplateDetail = {
        id: taskTemplate.id,
        title: taskTemplate.title,
        description: taskTemplate.description as TaskTemplateDetail['description'],
        tags: taskTemplate.tags,
        publicTestCases:
            (taskTemplate.publicTestCases as { input: string; output: string }[]) ?? [],
        privateTestCases:
            (taskTemplate.privateTestCases as { input: string; output: string }[]) ?? [],
        starterCodes: taskTemplate.starterCodes,
    };

    return <TaskEditor initialTemplate={templateDetail} />;
}
