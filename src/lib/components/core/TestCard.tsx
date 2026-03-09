import { type TestCaseDTO } from '@/lib/schemas/task-template.schema';
import { Lock, Trash, CopyPlus, Unlock } from 'lucide-react';
import { Input } from '@/lib/components/ui/Input';

type TestCardBaseProps = {
    test: TestCaseDTO;
    selected: boolean;
    setSelected: () => void;
    index: number;
    isPrivate: boolean;
};

type EditableTestCardProps = TestCardBaseProps & {
    readOnly?: false;
    isSaving?: boolean;
    onDuplicate: () => void;
    onRemove: () => void;
    onUpdate: (field: 'input' | 'output', value: string) => void;
    onToggle: () => void;
};

type ReadOnlyTestCardProps = TestCardBaseProps & {
    readOnly: true;
};

export type TestCardProps = EditableTestCardProps | ReadOnlyTestCardProps;

export default function TestCard(props: TestCardProps) {
    const { test, selected, setSelected, index, isPrivate } = props;
    const isSaving = !props.readOnly && props.isSaving;

    return (
        <div
            className={`border-border bg-background rounded-md border ${isSaving ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            onClick={isSaving ? undefined : setSelected}
        >
            <div className="flex items-center justify-between px-4 py-4">
                <span className="text-foreground text-sm font-medium">Test Case {index + 1}</span>
                {!props.readOnly && (
                    <div className="flex items-center gap-2">
                        <button
                            disabled={isSaving}
                            className="text-muted-foreground hover:text-foreground p-1 hover:cursor-pointer disabled:cursor-not-allowed"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onToggle();
                            }}
                        >
                            {isPrivate ? (
                                <Lock className="size-4" />
                            ) : (
                                <Unlock className="size-4" />
                            )}
                        </button>
                        <button
                            disabled={isSaving}
                            className="text-muted-foreground hover:text-foreground p-1 hover:cursor-pointer disabled:cursor-not-allowed"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onDuplicate();
                            }}
                        >
                            <CopyPlus width={16} height={16} />
                        </button>
                        <button
                            disabled={isSaving}
                            className="text-sarge-error-400 hover:text-destructive p-1 hover:cursor-pointer disabled:cursor-not-allowed"
                            onClick={(e) => {
                                e.stopPropagation();
                                props.onRemove();
                            }}
                        >
                            <Trash width={16} height={16} />
                        </button>
                    </div>
                )}
            </div>
            {selected && (
                <div className="px-4 pb-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-foreground mb-1 block text-sm font-medium">
                                Input
                            </label>
                            {props.readOnly ? (
                                <p className="text-body-s text-sarge-gray-700 bg-card rounded-md px-3 py-2">
                                    {test.input}
                                </p>
                            ) : (
                                <Input
                                    type="text"
                                    placeholder="Placeholder"
                                    value={test.input ?? ''}
                                    onChange={(e) => props.onUpdate('input', e.target.value)}
                                    className="w-full rounded-md px-3 py-2"
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={isSaving}
                                />
                            )}
                        </div>
                        <div>
                            <label className="text-foreground mb-1 block text-sm font-medium">
                                Expected Output
                            </label>
                            {props.readOnly ? (
                                <p className="text-body-s text-sarge-gray-700 bg-card rounded-md px-3 py-2">
                                    {test.output}
                                </p>
                            ) : (
                                <Input
                                    type="text"
                                    placeholder="Placeholder"
                                    value={test.output ?? ''}
                                    onChange={(e) => props.onUpdate('output', e.target.value)}
                                    className="w-full rounded-md px-3 py-2"
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={isSaving}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
