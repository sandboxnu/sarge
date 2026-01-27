import { Chip } from '@/lib/components/ui/Chip';
import { Square } from 'lucide-react';

export interface TaskCardProps {
    title: string;
    subtitle: string;
    chips: string[];
    selected: boolean;
}

export default function TaskCard(taskCardProps: TaskCardProps) {
    return (
        <div className="border-sarge-gray-200 flex gap-4.5 rounded-xl border-1 p-4">
            <div className="flex items-center">
                <Square className="h-5 w-5" />
            </div>
            <div className="flex flex-col gap-2.5">
                <div className="flex-col">
                    <div className="text-sm font-medium text-black">{taskCardProps.title}</div>
                    <div className="text-sarge-gray-500 text-xs font-medium">
                        {taskCardProps.subtitle}
                    </div>
                </div>
                <div className="flex gap-1">
                    {taskCardProps.chips.map((txt, idx) => {
                        return (
                            <Chip key={idx} className="rounded-md px-2 py-1 text-xs">
                                {txt}
                            </Chip>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
