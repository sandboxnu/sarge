'use client';

import { useState, useRef, useId } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/lib/components/ui/Button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/lib/components/ui/Select';
import { Input } from '@/lib/components/ui/Input';
import { TYPE_OPTIONS } from '@/lib/constants/code-stub.constants';
import { cn } from '@/lib/utils/cn.utils';

interface CodeStubGeneratorProps {
    selectedLanguages: string[];
}

interface Parameter {
    id: string;
    name: string;
    type: string;
}

export function CodeStubGenerator({ selectedLanguages }: CodeStubGeneratorProps) {
    const [functionName, setFunctionName] = useState('');
    const [returnType, setReturnType] = useState('');
    const [parameters, setParameters] = useState<Parameter[]>([]);

    const newParamInputRef = useRef<HTMLInputElement>(null);
    const baseId = useId();

    const isStubGeneratorDisabled = selectedLanguages.length === 0;

    const isGenerateDisabled = isStubGeneratorDisabled || !functionName.trim();

    const handleAddParameter = () => {
        const newParam: Parameter = {
            id: `${baseId}-param-${Date.now()}`,
            name: '',
            type: '',
        };
        setParameters((prev) => [...prev, newParam]);
        setTimeout(() => {
            newParamInputRef.current?.focus();
        }, 0);
    };

    const handleRemoveParameter = (id: string) => {
        setParameters((prev) => prev.filter((p) => p.id !== id));
    };

    const handleUpdateParameterName = (id: string, name: string) => {
        setParameters((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
    };

    const handleUpdateParameterType = (id: string, type: string) => {
        setParameters((prev) => prev.map((p) => (p.id === id ? { ...p, type } : p)));
    };

    const handleGenerate = () => {
        toast.success('Code stubs generated');
    };

    return (
        <div className={cn('mt-10', isStubGeneratorDisabled && 'opacity-60')}>
            <div className="flex items-center gap-2">
                <h3 className="text-label-m text-foreground">Code Stub Generator</h3>
                <span className="text-label-xs rounded-md bg-sarge-gray-200 px-2 py-0.5 text-sarge-gray-600">
                    Optional
                </span>
            </div>

            <p className="text-body-m mt-4 text-sarge-gray-600">
                Define a function signature to auto-generate starter code for all selected
                languages.
            </p>

            <div className="mt-6 grid gap-3" style={{ gridTemplateColumns: '1fr 1fr 46px' }}>
                <div>
                    <label
                        htmlFor="function-name"
                        className="text-label-s mb-2 block text-sarge-gray-600"
                    >
                        Function Name
                    </label>
                    <Input
                        id="function-name"
                        type="text"
                        placeholder="e.g., twoSum"
                        value={functionName}
                        onChange={(e) => setFunctionName(e.target.value)}
                        disabled={isStubGeneratorDisabled}
                        className={cn(
                            'text-body-m w-full rounded-md border-input bg-sarge-gray-0',
                            'placeholder:text-sarge-gray-300',
                            'hover:border-sarge-gray-300 hover:bg-sarge-gray-50',
                            'focus:border-sarge-primary-500 focus:bg-sarge-gray-50 focus:ring-1 focus:ring-sarge-primary-500',
                            'disabled:hover:bg-sarge-gray-0'
                        )}
                    />
                </div>
                <div className="col-span-2">
                    <label
                        htmlFor="return-type"
                        className="text-label-s mb-2 block text-sarge-gray-600"
                    >
                        Return Type
                    </label>
                    <Select
                        value={returnType}
                        onValueChange={setReturnType}
                        disabled={isStubGeneratorDisabled}
                    >
                        <SelectTrigger id="return-type">
                            <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                            {TYPE_OPTIONS.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                    <span className="text-label-s text-sarge-gray-600">Parameters</span>
                    <Button
                        type="button"
                        variant="tertiary"
                        onClick={handleAddParameter}
                        disabled={isStubGeneratorDisabled}
                        className={cn(
                            'text-label-s px-0 py-0 text-sarge-primary-600',
                            isStubGeneratorDisabled && 'cursor-not-allowed opacity-40'
                        )}
                    >
                        + Add parameter
                    </Button>
                </div>

                {parameters.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-sarge-gray-50 px-6 py-8 text-center">
                        <p className="text-label-s text-sarge-gray-600">No parameters defined.</p>
                        <p className="text-body-s mt-1 text-sarge-gray-500">
                            Click &quot;+ Add parameter&quot; to define function inputs.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {parameters.map((param, index) => (
                            <div
                                key={param.id}
                                className="grid gap-3"
                                style={{ gridTemplateColumns: '1fr 1fr 46px' }}
                            >
                                <div>
                                    {index === 0 && (
                                        <label className="text-label-s mb-2 block text-sarge-gray-600">
                                            Name
                                        </label>
                                    )}
                                    <Input
                                        ref={
                                            index === parameters.length - 1
                                                ? newParamInputRef
                                                : undefined
                                        }
                                        type="text"
                                        placeholder="Parameter name..."
                                        value={param.name}
                                        onChange={(e) =>
                                            handleUpdateParameterName(param.id, e.target.value)
                                        }
                                        disabled={isStubGeneratorDisabled}
                                        className={cn(
                                            'text-body-m w-full rounded-md border-input bg-sarge-gray-0',
                                            'placeholder:text-sarge-gray-300',
                                            'hover:border-sarge-gray-300 hover:bg-sarge-gray-50',
                                            'focus:border-sarge-primary-500 focus:bg-sarge-gray-50 focus:ring-1 focus:ring-sarge-primary-500',
                                            'disabled:hover:bg-sarge-gray-0'
                                        )}
                                    />
                                </div>
                                <div>
                                    {index === 0 && (
                                        <label className="text-label-s mb-2 block text-sarge-gray-600">
                                            Type
                                        </label>
                                    )}
                                    <Select
                                        value={param.type}
                                        onValueChange={(value) =>
                                            handleUpdateParameterType(param.id, value)
                                        }
                                        disabled={isStubGeneratorDisabled}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TYPE_OPTIONS.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className={cn('flex items-end', index === 0 && 'pb-0')}>
                                    <Button
                                        type="button"
                                        variant="destructive-outline"
                                        size="default"
                                        onClick={() => handleRemoveParameter(param.id)}
                                        disabled={isStubGeneratorDisabled}
                                        className="size-[46px] p-0"
                                        aria-label="Remove parameter"
                                    >
                                        <X className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6">
                <Button
                    type="button"
                    variant="primary"
                    size="md"
                    onClick={handleGenerate}
                    disabled={isGenerateDisabled}
                >
                    Generate
                </Button>
            </div>
        </div>
    );
}
