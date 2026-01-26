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

    try {
        const taskTemplate = await TaskTemplateService.getTaskTemplateDetail(
            id,
            session.activeOrganizationId
        );

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
    } catch (error) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <h1 className="text-display-xs text-sarge-gray-900">Task Template Not Found</h1>
                    <p className="text-body-m mt-2 text-sarge-gray-600">
                        {(error as Error).message ||
                            "The task template you're looking for doesn't exist."}
                    </p>
                </div>
            </div>
        );
    }
}
