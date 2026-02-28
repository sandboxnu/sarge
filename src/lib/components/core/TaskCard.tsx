import { Checkbox } from '@/lib/components/ui/Checkbox';
import { Chip } from '@/lib/components/ui/Chip';
import ChipOverflow from '@/lib/components/ui/ChipOverflow';
import type { TagDTO } from '@/lib/schemas/tag.schema';
import type { TaskTemplateLanguageDTO } from '@/lib/schemas/task-template-language.schema';
import { getLanguageLabel } from '@/lib/utils/language.utils';
import { Code2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';

export interface TaskCardProps {
    title: string;
    subtitle: string;
    chips: TagDTO[];
    languages?: TaskTemplateLanguageDTO[];
    isSelected: boolean;
    setIsSelected: (index: number) => void;
    index: number;
    taskTemplateId?: string;
    isPreviewSelected?: boolean;
    onPreviewSelect?: () => void;
    maxTags?: number;
}

export default function TaskCard({ maxTags = 2, ...props }: TaskCardProps) {
    const visibleChips = props.chips.slice(0, maxTags);
    const overflowChips = props.chips.slice(maxTags);

    return (
        <div
            className={cn(
                'flex cursor-pointer gap-4.5 rounded-xl border-1 p-4',
                props.isPreviewSelected
                    ? 'border-sarge-primary-500 bg-sarge-primary-50 ring-sarge-primary-200 ring-2 ring-inset'
                    : 'border-sarge-gray-200 hover:bg-sarge-primary-100 hover:border-sarge-primary-400'
            )}
            role={props.onPreviewSelect ? 'button' : undefined}
            tabIndex={props.onPreviewSelect ? 0 : undefined}
            onClick={() => props.onPreviewSelect?.()}
            onKeyDown={(e) => {
                if (props.onPreviewSelect && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    props.onPreviewSelect();
                }
            }}
        >
            <div
                className="flex shrink-0 cursor-pointer items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <Checkbox
                    checked={props.isSelected}
                    onCheckedChange={() => props.setIsSelected(props.index)}
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <div className="flex flex-col gap-1.5">
                    <div className="text-label-s text-foreground truncate">{props.title}</div>
                    <div className="text-label-xs text-sarge-gray-500">{props.subtitle}</div>
                    {props.languages && props.languages.length > 0 && (
                        <div className="text-label-xs text-sarge-gray-500 flex items-center gap-1.5">
                            <Code2 className="size-3.5 shrink-0" />
                            <span className="truncate">
                                {props.languages
                                    .map((l) => getLanguageLabel(l.language))
                                    .join(', ')}
                            </span>
                        </div>
                    )}
                </div>
                <div className="flex flex-wrap gap-1">
                    {visibleChips.map((chip, idx) => (
                        <Chip
                            key={chip.id ?? idx}
                            className="rounded-md px-2 py-1 text-xs"
                            style={{ backgroundColor: chip.colorHexCode }}
                        >
                            {chip.name}
                        </Chip>
                    ))}
                    <ChipOverflow chips={overflowChips} />
                </div>
            </div>
        </div>
    );
}
