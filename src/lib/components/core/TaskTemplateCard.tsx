import { type TaskTemplateListItem } from '@/lib/types/task-template.types';
import { getTagTextColor } from '@/lib/utils/color.utils';
import { cn } from '@/lib/utils/cn.utils';

interface TaskTemplateCardProps {
    template: TaskTemplateListItem;
    isSelected: boolean;
    onClick: () => void;
}

export default function TaskTemplateCard({ template, isSelected, onClick }: TaskTemplateCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'w-full rounded-lg border p-4 text-left transition-colors',
                isSelected
                    ? 'border-sarge-primary-500 bg-sarge-primary-100'
                    : 'border-sarge-gray-200 hover:bg-sarge-gray-50'
            )}
        >
            <h3 className="text-label-s mb-2 text-sarge-gray-900">{template.title}</h3>
            {template.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag) => (
                        <span
                            key={tag.id}
                            className="rounded px-2 py-0.5 text-xs font-medium"
                            style={{
                                backgroundColor: tag.colorHexCode ?? '#F1F1EF',
                                color: getTagTextColor(tag.colorHexCode),
                            }}
                        >
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}
        </button>
    );
}
