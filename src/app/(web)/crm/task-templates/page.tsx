import { ListChecks } from 'lucide-react';
import TaskTemplateService from '@/lib/services/task-template.service';
import { getSession } from '@/lib/utils/auth.utils';
import TaskTemplatesContent from '@/lib/components/core/TaskTemplatesContent';

export default async function TaskTemplatesPage() {
    const session = await getSession();

    const templates = await TaskTemplateService.getAllTaskTemplatesByOrgId(
        session.activeOrganizationId
    );
    // This uses the server component to fetch the tasks (we don't do this in other parts of the repo (for example positions))
    // however this is faster (thoughts) - I'll remove this comment later

    return (
        <div className="flex flex-col gap-3 pb-5 pl-7 pr-5 pt-4">
            <div className="flex items-center gap-2">
                <ListChecks className="size-5" />
                <h1 className="text-display-xs">Coding Tasks</h1>
            </div>

            <TaskTemplatesContent templates={templates} />
        </div>
    );
}
