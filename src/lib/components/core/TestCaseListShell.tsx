'use client';

import { useState } from 'react';
import TestCard from '@/lib/components/core/TestCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/Tabs';
import type { TestCaseDTO } from '@/lib/schemas/task-template.schema';
import type { TestTab } from '@/lib/hooks/useTestCaseEditor';

type TestCaseListShellBaseProps = {
    publicTestCases: TestCaseDTO[];
    privateTestCases: TestCaseDTO[];
    headerAction?: React.ReactNode;
};

type EditableShellProps = TestCaseListShellBaseProps & {
    readOnly?: false;
    onDuplicate: (index: number, tab: TestTab) => void;
    onRemove: (index: number, tab: TestTab) => void;
    onUpdate: (index: number, tab: TestTab, field: 'input' | 'output', value: string) => void;
    onToggleVisibility: (index: number, tab: TestTab) => void;
};

type ReadOnlyShellProps = TestCaseListShellBaseProps & {
    readOnly: true;
};

export type TestCaseListShellProps = EditableShellProps | ReadOnlyShellProps;

const TAB_BASE =
    '!text-sarge-gray-700 border-sarge-gray-300 bg-sarge-gray-100 rounded-none px-3 py-1 text-sm font-medium';

const TAB_TRIGGER_CLASSES = {
    all: `border=[0.5px] ${TAB_BASE} border-r-0 data-[state=active]:!bg-white data-[state=active]:!shadow-none`,
    public: `border=[0.5px] ${TAB_BASE} border-r-0 data-[state=active]:!bg-white data-[state=active]:!shadow-none`,
    private: `${TAB_BASE} border data-[state=active]:!border-b-0 data-[state=active]:!bg-white`,
};

export default function TestCaseListShell(props: TestCaseListShellProps) {
    const { publicTestCases, privateTestCases, headerAction } = props;

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

    if (allTestCases.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-body-s text-muted-foreground">No test cases</p>
            </div>
        );
    }

    function renderCard(test: TestCaseDTO, index: number, tab: TestTab, isPrivate: boolean) {
        const baseProps = {
            test,
            index,
            selected: isSelected(tab, index),
            setSelected: () => toggleSelected(tab, index),
            isPrivate,
        };

        if (props.readOnly) {
            return <TestCard key={`${tab}-${index}`} {...baseProps} readOnly />;
        }

        return (
            <TestCard
                key={`${tab}-${index}`}
                {...baseProps}
                onDuplicate={() => props.onDuplicate(index, tab)}
                onRemove={() => props.onRemove(index, tab)}
                onUpdate={(field, value) => props.onUpdate(index, tab, field, value)}
                onToggle={() => props.onToggleVisibility(index, tab)}
            />
        );
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as TestTab)}
                className="flex flex-1 flex-col overflow-hidden"
            >
                <div className="border-sarge-gray-200 bg-sarge-gray-200 shrink-0 border-b">
                    <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
                        <TabsTrigger value="all" className={TAB_TRIGGER_CLASSES.all}>
                            All Test Cases
                        </TabsTrigger>
                        <TabsTrigger value="public" className={TAB_TRIGGER_CLASSES.public}>
                            Public Test Cases
                        </TabsTrigger>
                        <TabsTrigger value="private" className={TAB_TRIGGER_CLASSES.private}>
                            Private Test Cases
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="flex shrink-0 items-center justify-between border-b px-4 pb-2">
                    <span className="text-md font-medium">
                        {activeLabel} ({activeTestCases.length})
                    </span>
                    {headerAction}
                </div>

                <TabsContent
                    value="all"
                    className="mb-2 flex flex-1 flex-col gap-2 overflow-y-auto px-4"
                >
                    {allTestCases.map((test, index) =>
                        renderCard(test, index, 'all', index >= publicTestCases.length)
                    )}
                </TabsContent>

                <TabsContent
                    value="public"
                    className="mb-2 flex flex-1 flex-col gap-2 overflow-y-auto px-4"
                >
                    {publicTestCases.map((test, index) => renderCard(test, index, 'public', false))}
                </TabsContent>

                <TabsContent
                    value="private"
                    className="mb-2 flex flex-1 flex-col gap-2 overflow-y-auto px-4"
                >
                    {privateTestCases.map((test, index) =>
                        renderCard(test, index, 'private', true)
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
