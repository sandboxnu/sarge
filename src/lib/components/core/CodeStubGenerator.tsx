'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { Field, FieldLabel } from '@/lib/components/ui/Field';
import { Input } from '@/lib/components/ui/Input';
import { Button } from '@/lib/components/ui/Button';
import TypeSelect from '@/lib/components/core/TypeSelect';

interface StubParameter {
    id: number;
    name: string;
    type: string;
}

interface CodeStubGeneratorProps {
    disabled: boolean;
}

export default function CodeStubGenerator({ disabled }: CodeStubGeneratorProps) {
    const [functionName, setFunctionName] = React.useState('');
    const [returnType, setReturnType] = React.useState('');
    const [parameters, setParameters] = React.useState<StubParameter[]>([]);
    const nextParamId = React.useRef(0);

    const addParameter = () => {
        setParameters((prev) => [...prev, { id: nextParamId.current++, name: '', type: '' }]);
    };

    const updateParameter = (id: number, field: 'name' | 'type', value: string) => {
        setParameters((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const removeParameter = (id: number) => {
        setParameters((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col">
                <span className="text-label-s text-sarge-gray-800">Code Stub Generator</span>
                <span className="text-sarge-gray-500 text-[11px] leading-4">
                    Auto-generate starter code for all selected languages
                </span>
            </div>

            <div className="flex w-full items-start gap-2.5">
                <Field className="min-w-0 flex-1 gap-2">
                    <FieldLabel className="text-label-s text-sarge-gray-800">
                        Function Name
                    </FieldLabel>
                    <Input
                        value={functionName}
                        onChange={(e) => setFunctionName(e.target.value)}
                        placeholder="eg. TwoSum"
                        className="text-body-s h-11 w-full"
                    />
                </Field>

                <Field className="min-w-0 flex-1 gap-2">
                    <FieldLabel className="text-label-s text-sarge-gray-800">
                        Return Type
                    </FieldLabel>
                    <TypeSelect value={returnType} onValueChange={setReturnType} />
                </Field>
            </div>

            <div className="flex w-full items-center justify-between">
                <span className="text-label-s text-sarge-gray-800">Parameters</span>
                <Button variant={'tertiary'} onClick={addParameter}>
                    + Add parameter
                </Button>
            </div>

            {parameters.map((param) => (
                <div key={param.id} className="flex w-full items-end gap-2.5">
                    <div className="min-w-0 flex-1">
                        <Input
                            value={param.name}
                            onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
                            placeholder="eg. Foo"
                            className="text-body-s h-11 w-full"
                        />
                    </div>
                    <div className="flex min-w-0 flex-1 items-center gap-1.5">
                        <TypeSelect
                            value={param.type}
                            onValueChange={(val) => updateParameter(param.id, 'type', val)}
                        />
                        <button
                            type="button"
                            onClick={() => removeParameter(param.id)}
                            className="text-sarge-gray-500 hover:text-sarge-gray-800 shrink-0 cursor-pointer p-1"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex w-full justify-end">
                <Button variant="primary" disabled={disabled} className="h-9 px-4">
                    Generate Stub
                </Button>
            </div>
        </div>
    );
}
