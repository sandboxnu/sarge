import { Chip } from '@/lib/components/ui/Chip';
import type { TagDTO } from '@/lib/schemas/tag.schema';
import { Square, SquareCheck } from 'lucide-react';
import { cn } from '@/lib/utils/cn.utils';

export interface TaskCardProps {
    title: string;
    subtitle: string;
    chips: TagDTO[];
    selected: boolean;
    setSelected: (index: number) => void;
    index: number;
    taskTemplateId?: string;
    isPreviewSelected?: boolean;
    onPreviewSelect?: () => void;
}

export default function TaskCard(props: TaskCardProps) {
    return (
        <div
            className={cn(
                'flex gap-4.5 rounded-xl border-1 p-4',
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
                onClick={(e) => {
                    e.stopPropagation();
                    props.setSelected(props.index);
                }}
            >
                {props.selected ? (
                    <SquareCheck className="size-5" />
                ) : (
                    <Square className="h-5 w-5" />
                )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <div className="flex-col">
                    <div className="text-foreground truncate text-sm font-medium">
                        {props.title}
                    </div>
                    <div className="text-sarge-gray-500 font-sans text-xs leading-4 font-medium tracking-[0.406px]">
                        {props.subtitle}
                    </div>
                </div>
                <div className="flex flex-wrap gap-1">
                    {props.chips.map((chip, idx) => (
                        <Chip
                            key={chip.id ?? idx}
                            className="rounded-md px-2 py-1 text-xs"
                            style={{ backgroundColor: chip.colorHexCode }}
                        >
                            {chip.name}
                        </Chip>
                    ))}
                </div>
            </div>
        </div>
    );
}
