import { type TestCaseDTO } from '@/lib/schemas/task-template.schema';
import { Lock, Trash, CopyPlus, Unlock } from 'lucide-react';
import { Input } from '@/lib/components/ui/Input';

export interface TestCardProps {
    test: TestCaseDTO;
    selected: boolean;
    setSelected: () => void;
    index: number;
    onDuplicate: () => void;
    onRemove: () => void;
    onUpdate: (field: 'input' | 'output', value: string) => void;
    onToggle: () => void;
    isPrivate: boolean;
    isSaving: boolean;
}

export default function TestCard(props: TestCardProps) {
    const {
        test,
        selected,
        setSelected,
        index,
        onDuplicate,
        onRemove,
        onUpdate,
        onToggle,
        isPrivate,
        isSaving,
    } = props;

    return (
        <div
            className={`border-sarge-gray-200 rounded-md border border-1 bg-white ${isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={isSaving ? undefined : setSelected}
        >
            <div className="flex items-center justify-between px-4 py-4">
                <span className="text-sm font-medium text-gray-800">Test Case {index + 1}</span>
                <div className="flex items-center gap-2">
                    <button
                        disabled={isSaving}
                        className="p-1 text-gray-400 hover:cursor-pointer hover:text-gray-600 disabled:cursor-not-allowed"
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggle();
                        }}
                    >
                        {isPrivate ? <Lock className="size-4" /> : <Unlock className="size-4" />}
                    </button>
                    <button
                        disabled={isSaving}
                        className="p-1 text-gray-400 hover:cursor-pointer hover:text-gray-600 disabled:cursor-not-allowed"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate();
                        }}
                    >
                        <CopyPlus width={16} height={16} />
                    </button>
                    <button
                        disabled={isSaving}
                        className="text-sarge-error-400 p-1 hover:cursor-pointer hover:text-red-600 disabled:cursor-not-allowed"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                    >
                        <Trash width={16} height={16} />
                    </button>
                </div>
            </div>
            {selected && (
                <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Input
                            </label>
                            <Input
                                type="text"
                                placeholder="Placeholder"
                                value={test.input ?? ''}
                                onChange={(e) => onUpdate('input', e.target.value)}
                                className="w-full rounded-md px-3 py-2"
                                onClick={(e) => e.stopPropagation()}
                                disabled={isSaving}
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Expected Output
                            </label>
                            <Input
                                type="text"
                                placeholder="Placeholder"
                                value={test.output ?? ''}
                                onChange={(e) => onUpdate('output', e.target.value)}
                                className="w-full rounded-md px-3 py-2"
                                onClick={(e) => e.stopPropagation()}
                                disabled={isSaving}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
