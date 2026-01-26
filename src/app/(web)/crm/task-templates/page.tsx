import { ListChecks } from 'lucide-react';
import TaskTemplateService from '@/lib/services/task-template.service';
import { getSession } from '@/lib/utils/auth.utils';
import TaskTemplatesContent from '@/lib/components/core/TaskTemplatesContent';

export default async function TaskTemplatesPage() {
    const session = await getSession();

    const templates = await TaskTemplateService.getAllTaskTemplatesByOrgId(
        session.activeOrganizationId
    );
    
    return (
        <div className="flex flex-col gap-3 pt-4 pr-5 pb-5 pl-7">
            <div className="flex items-center gap-2">
                <ListChecks className="size-5" />
                <h1 className="text-display-xs">Coding Tasks</h1>
            </div>

            <TaskTemplatesContent templates={templates} />
        </div>
    );
}
