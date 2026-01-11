'use client';

import { Chip } from '@/lib/components/ui/Chip';
import { Trash2, Eye, EyeOff } from 'lucide-react';

interface TestCase {
    id: string;
    input: string;
    output: string;
    isPublic: boolean;
}

interface TestCaseEditorProps {
    testCase: TestCase;
    onUpdate: (field: 'input' | 'output', value: string) => void;
    onToggleVisibility: () => void;
    onDelete: () => void;
    canDelete: boolean;
}

export default function TestCaseEditor({
    testCase,
    onUpdate,
    onToggleVisibility,
    onDelete,
    canDelete,
}: TestCaseEditorProps) {
    return (
        <div className="flex h-full flex-col p-4">
            <div className="mb-4 flex flex-shrink-0 items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-label-xs font-medium text-sarge-gray-600">
                        Visibility:
                    </span>
                    <button
                        onClick={onToggleVisibility}
                        className="flex items-center gap-2 rounded-lg border border-sarge-gray-200 bg-white px-3 py-2 text-sarge-gray-800 transition-colors hover:bg-sarge-gray-50"
                    >
                        {testCase.isPublic ? (
                            <>
                                <Eye className="h-4 w-4" />
                                <span className="text-sm">Public</span>
                            </>
                        ) : (
                            <>
                                <EyeOff className="h-4 w-4" />
                                <span className="text-sm">Private</span>
                            </>
                        )}
                    </button>
                    <Chip variant="neutral">
                        {testCase.isPublic ? 'Visible to candidates' : 'Hidden from candidates'}
                    </Chip>
                </div>
                <button
                    onClick={onDelete}
                    disabled={!canDelete}
                    className="flex items-center gap-2 rounded-lg border border-sarge-error-200 bg-white px-3 py-2 text-sarge-error-700 transition-colors hover:bg-sarge-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="text-sm">Delete</span>
                </button>
            </div>

            <div className="mb-4 flex min-h-0 flex-1 flex-col">
                <label className="text-label-xs mb-2 block flex-shrink-0 font-semibold text-sarge-gray-600">
                    Input
                </label>
                <textarea
                    value={testCase.input}
                    onChange={(e) => onUpdate('input', e.target.value)}
                    className="min-h-0 w-full flex-1 resize-none rounded-lg border border-sarge-gray-200 bg-sarge-gray-50 p-3 font-mono text-sm text-sarge-gray-800 placeholder-sarge-gray-500 transition-colors hover:border-sarge-gray-300 focus:border-sarge-primary-500 focus:outline-none focus:ring-0"
                    placeholder="Enter input for this test case..."
                />
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                <label className="text-label-xs mb-2 block flex-shrink-0 font-semibold text-sarge-gray-600">
                    Expected Output
                </label>
                <textarea
                    value={testCase.output}
                    onChange={(e) => onUpdate('output', e.target.value)}
                    className="min-h-0 w-full flex-1 resize-none rounded-lg border border-sarge-gray-200 bg-sarge-gray-50 p-3 font-mono text-sm text-sarge-gray-800 placeholder-sarge-gray-500 transition-colors hover:border-sarge-gray-300 focus:border-sarge-primary-500 focus:outline-none focus:ring-0"
                    placeholder="Enter expected output..."
                />
            </div>
        </div>
    );
}
