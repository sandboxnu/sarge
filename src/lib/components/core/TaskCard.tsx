import { Chip } from '@/lib/components/ui/Chip';
import type { TagDTO } from '@/lib/schemas/tag.schema';
import { Square } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';

export interface TaskCardProps {
    taskTemplateId: string;
    title: string;
    subtitle: string;
    tags: TagDTO[];
    isSelected: boolean;
    onSelect?: () => void;
}

export default function TaskCard({
    // taskTemplateId,
    title,
    subtitle,
    tags,
    isSelected,
    onSelect,
}: TaskCardProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className={cn(
                'bg-background flex gap-4.5 rounded-xl border-1 p-4 text-left transition-colors',
                isSelected
                    ? 'border-sarge-primary-500 ring-sarge-primary-200 ring-2 ring-inset'
                    : 'border-sarge-gray-200 hover:border-sarge-primary-400'
            )}
        >
            <div className="flex items-center">
                <Square className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <div className="flex-col">
                    <div className="text-sm font-medium text-black">{title}</div>
                    <div className="text-sarge-gray-500 text-xs font-medium">{subtitle}</div>
                </div>
                <div className="flex flex-wrap gap-1">
                    {tags.map((tag) => (
                        <Chip
                            key={tag.id}
                            className="rounded-md px-2 py-1 text-xs text-black"
                            style={{ backgroundColor: tag.colorHexCode }}
                        >
                            {tag.name}
                        </Chip>
                    ))}
                </div>
            </div>
        </button>
    );
}
