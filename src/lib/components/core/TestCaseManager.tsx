'use client';

import { Button } from '@/lib/components/ui/Button';
import { Chip } from '@/lib/components/ui/Chip';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/lib/components/ui/Tabs';
import TestCaseEditor from '@/lib/components/core/TestCaseEditor';
import { Plus } from 'lucide-react';

interface TestCase {
    id: string;
    input: string;
    output: string;
    isPublic: boolean;
}

interface TestCaseManagerProps {
    testCases: TestCase[];
    selectedTestCaseId: string | null;
    onSelectTestCase: (id: string) => void;
    onAdd: () => void;
    onDelete: (id: string) => void;
    onUpdate: (id: string, field: 'input' | 'output', value: string) => void;
    onToggleVisibility: (id: string) => void;
    testOutput: string;
}

export default function TestCaseManager({
    testCases,
    selectedTestCaseId,
    onSelectTestCase,
    onAdd,
    onDelete,
    onUpdate,
    onToggleVisibility,
    testOutput,
}: TestCaseManagerProps) {
    const publicTestCasesCount = testCases.filter((tc) => tc.isPublic).length;

    return (
        <div className="flex h-full flex-col">
            {testCases.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center p-8">
                    <p className="mb-4 text-sarge-gray-500">No test cases yet</p>
                    <Button onClick={onAdd} variant="primary" className="gap-2 px-4 py-2">
                        <Plus className="h-4 w-4" />
                        Add First Test Case
                    </Button>
                </div>
            ) : (
                <Tabs
                    value={selectedTestCaseId ?? undefined}
                    onValueChange={onSelectTestCase}
                    className="flex h-full flex-col"
                >
                    <div className="flex items-center justify-between border-b border-sarge-gray-200 bg-sarge-gray-50 px-4 py-3">
                        <TabsList className="flex-1 justify-start">
                            {testCases.map((tc, idx) => (
                                <TabsTrigger key={tc.id} value={tc.id} className="gap-2">
                                    Test {idx + 1}
                                    <Chip variant="neutral" className="text-xs">
                                        {tc.isPublic ? 'Public' : 'Private'}
                                    </Chip>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <Button onClick={onAdd} variant="secondary" className="ml-2 gap-2 px-4 py-2">
                            <Plus className="h-4 w-4" />
                            Add Test Case
                        </Button>
                    </div>

                    <div className="flex flex-1 flex-col overflow-hidden">
                        {testCases.map((tc) => (
                            <TabsContent key={tc.id} value={tc.id} className="flex-1 overflow-auto">
                                <TestCaseEditor
                                    testCase={tc}
                                    onUpdate={(field, value) => onUpdate(tc.id, field, value)}
                                    onToggleVisibility={() => onToggleVisibility(tc.id)}
                                    onDelete={() => onDelete(tc.id)}
                                    canDelete={!tc.isPublic || publicTestCasesCount > 1}
                                />
                            </TabsContent>
                        ))}
                    </div>
                </Tabs>
            )}

            <div className="border-t border-sarge-gray-200 bg-sarge-gray-50 p-4">
                <h3 className="text-label-xs mb-2 font-semibold text-sarge-gray-600">
                    Test Output:
                </h3>
                <pre className="max-h-32 overflow-auto whitespace-pre-wrap rounded-lg border border-sarge-gray-200 bg-white p-3 font-mono text-sm text-sarge-gray-900">
                    {testOutput || 'Run your code to see output...'}
                </pre>
            </div>
        </div>
    );
}
