'use client';

import { useState } from 'react';
import TestCaseCard from '@/lib/components/core/TestCaseCard';
import { Tabs, TabsContent, TabsList, TestCaseTabsTrigger } from '@/lib/components/ui/Tabs';
import { Button } from '@/lib/components/ui/Button';
import { PlusIcon } from 'lucide-react';
import type { TestCaseDTO } from '@/lib/schemas/task-template.schema';
import type { TestTab } from '@/lib/hooks/useTestCaseEditor';

type TestCasePanelBaseProps = {
    publicTestCases: TestCaseDTO[];
    privateTestCases: TestCaseDTO[];
};

type EditablePanelProps = TestCasePanelBaseProps & {
    readOnly?: false;
    isSaving?: boolean;
    onAddTestCase: (tab: TestTab) => void;
    onDuplicateTestCase: (index: number, tab: TestTab) => void;
    onRemoveTestCase: (index: number, tab: TestTab) => void;
    onTestCaseUpdate: (
        index: number,
        tab: TestTab,
        field: 'input' | 'output',
        value: string
    ) => void;
    onToggleTestCaseVisibility: (index: number, tab: TestTab) => void;
    runTests: (tests: TestCaseDTO[]) => void;
};

type ReadOnlyPanelProps = TestCasePanelBaseProps & {
    readOnly: true;
};

export type TestCasePanelProps = EditablePanelProps | ReadOnlyPanelProps;

export default function TestCasePanel(props: TestCasePanelProps) {
    const { publicTestCases, privateTestCases } = props;

    const [activeTab, setActiveTab] = useState<TestTab>('all');
    const [selectedIndices, setSelectedIndices] = useState<Set<string>>(new Set());

    const allTestCases = [...publicTestCases, ...privateTestCases];

    const activeTestCases =
        activeTab === 'all'
            ? allTestCases
            : activeTab === 'public'
              ? publicTestCases
              : privateTestCases;

    const activeLabel =
        activeTab === 'all'
            ? 'All Test Cases'
            : activeTab === 'public'
              ? 'Public Test Cases'
              : 'Private Test Cases';

    function getKey(tab: TestTab, index: number) {
        return `${tab}-${index}`;
    }

    function isSelected(tab: TestTab, index: number) {
        return selectedIndices.has(getKey(tab, index));
    }

    function toggleSelected(tab: TestTab, index: number) {
        setSelectedIndices((prev) => {
            const next = new Set(prev);
            const key = getKey(tab, index);
            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }
            return next;
        });
    }

    function renderCard(test: TestCaseDTO, index: number, tab: TestTab, isPrivate: boolean) {
        const baseProps = {
            variant: 'editor' as const,
            test,
            index,
            selected: isSelected(tab, index),
            onSelect: () => toggleSelected(tab, index),
            isPrivate,
        };

        if (props.readOnly) {
            return <TestCaseCard key={`${tab}-${index}`} {...baseProps} readOnly />;
        }

        return (
            <TestCaseCard
                key={`${tab}-${index}`}
                {...baseProps}
                isSaving={props.isSaving}
                onDuplicate={() => props.onDuplicateTestCase(index, tab)}
                onRemove={() => props.onRemoveTestCase(index, tab)}
                onUpdate={(field, value) => props.onTestCaseUpdate(index, tab, field, value)}
                onToggleVisibility={() => props.onToggleTestCaseVisibility(index, tab)}
            />
        );
    }

    function renderTestCaseTab(testCases: TestCaseDTO[], tab: TestTab, emptyMessage: string) {
        const content =
            testCases.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                    <p className="text-body-s text-muted-foreground">{emptyMessage}</p>
                </div>
            ) : (
                testCases.map((test, index) => {
                    const isPrivate =
                        tab === 'private' || (tab === 'all' && index >= publicTestCases.length);
                    return renderCard(test, index, tab, isPrivate);
                })
            );

        return (
            <TabsContent
                key={tab}
                value={tab}
                className="mb-2 flex flex-1 flex-col gap-2 overflow-y-auto px-4"
            >
                {content}
            </TabsContent>
        );
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as TestTab)}
                className="flex flex-1 flex-col overflow-hidden"
            >
                <div className="border-sarge-gray-500 bg-sarge-gray-100 shrink-0">
                    <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
                        <TestCaseTabsTrigger value="all">All Test Cases</TestCaseTabsTrigger>
                        <TestCaseTabsTrigger value="public">Public Test Cases</TestCaseTabsTrigger>
                        <TestCaseTabsTrigger value="private">
                            Private Test Cases
                        </TestCaseTabsTrigger>
                        <div className="border-sarge-gray-300 bg-sarge-gray-100 flex-1 border-r border-b" />
                    </TabsList>
                </div>

                <div className="flex shrink-0 items-center justify-between px-4 py-2">
                    <span className="text-md font-medium">
                        {activeLabel} ({activeTestCases.length})
                    </span>
                    {!props.readOnly && (
                        <div className="flex items-center justify-between gap-2">
                            <Button
                                className="items-center gap-1 rounded-md px-3 py-1 text-sm"
                                variant="secondary"
                                onClick={() => props.onAddTestCase(activeTab)}
                                disabled={props.isSaving}
                            >
                                <PlusIcon
                                    className="stroke-sarge-primary-500"
                                    height={18}
                                    width={18}
                                />
                                Add test
                            </Button>
                            <Button
                                className="items-center rounded-md px-3 py-1 text-sm"
                                variant="primary"
                                onClick={() => props.runTests(activeTestCases)}
                            >
                                Run
                            </Button>
                        </div>
                    )}
                </div>

                {renderTestCaseTab(allTestCases, 'all', 'No test cases')}
                {renderTestCaseTab(publicTestCases, 'public', 'No public test cases')}
                {renderTestCaseTab(privateTestCases, 'private', 'No private test cases')}
            </Tabs>
        </div>
    );
}
