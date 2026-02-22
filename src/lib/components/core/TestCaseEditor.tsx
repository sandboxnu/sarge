import TestCard from '@/lib/components/core/TestCard';
import { Button } from '@/lib/components/ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/lib/components/ui/Tabs';
import { type TestCaseDTO } from '@/lib/schemas/task-template.schema';
import useTestCaseEditor, { type TestTab } from '@/lib/hooks/useTestCaseEditor';
import { PlusIcon } from 'lucide-react';

interface TestCaseEditorProps {
    publicTestCases: TestCaseDTO[];
    setPublicTestCases: React.Dispatch<React.SetStateAction<TestCaseDTO[]>>;
    privateTestCases: TestCaseDTO[];
    setPrivateTestCases: React.Dispatch<React.SetStateAction<TestCaseDTO[]>>;
    isSaving: boolean;
}

export default function TestCaseEditor(props: TestCaseEditorProps) {
    const { publicTestCases, setPublicTestCases, privateTestCases, setPrivateTestCases, isSaving } =
        props;
    const {
        activeTestTab,
        setActiveTestTab,
        addTestCase,
        removeTestCase,
        duplicateTestCase,
        updateTestCase,
        toggleTestCaseVisibility,
        allTestCases,
        activeTestCases,
        activeLabel,
        isSelected,
        toggleSelected,
    } = useTestCaseEditor(
        publicTestCases,
        setPublicTestCases,
        privateTestCases,
        setPrivateTestCases
    );

    return (
        <div className="flex flex-1 flex-col overflow-hidden">
            <Tabs
                value={activeTestTab}
                onValueChange={isSaving ? undefined : (v) => setActiveTestTab(v as TestTab)}
                className="flex flex-1 flex-col overflow-hidden"
            >
                <div className="border-sarge-gray-200 bg-sarge-gray-200 shrink-0 border-b">
                    <TabsList className="h-auto gap-0 rounded-none bg-transparent p-0">
                        <TabsTrigger
                            value="all"
                            disabled={isSaving}
                            className="border=[0.5px] !text-sarge-gray-700 border-sarge-gray-300 bg-sarge-gray-100 rounded-none border-r-0 px-3 py-1 text-sm font-medium data-[state=active]:!bg-white data-[state=active]:!shadow-none"
                        >
                            All Test Cases
                        </TabsTrigger>
                        <TabsTrigger
                            value="public"
                            disabled={isSaving}
                            className="border=[0.5px] !text-sarge-gray-700 border-sarge-gray-300 bg-sarge-gray-100 rounded-none border-r-0 px-3 py-1 text-sm font-medium data-[state=active]:!bg-white data-[state=active]:!shadow-none"
                        >
                            Public Test Cases
                        </TabsTrigger>
                        <TabsTrigger
                            value="private"
                            disabled={isSaving}
                            className="!text-sarge-gray-700 border-sarge-gray-300 bg-sarge-gray-100 rounded-none border px-3 py-1 text-sm font-medium data-[state=active]:!border-b-0 data-[state=active]:!bg-white"
                        >
                            Private Test Cases
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b px-4 pb-2">
                    <span className="text-md font-medium">
                        {activeLabel} ({activeTestCases.length})
                    </span>
                    <Button
                        className="items-center gap-1 rounded-md px-3 py-1 text-sm"
                        variant="secondary"
                        onClick={addTestCase}
                        disabled={isSaving}
                    >
                        <PlusIcon className="stroke-sarge-primary-500" height={18} width={18} />
                        Add test
                    </Button>
                </div>

                <TabsContent
                    value="all"
                    className="mb-2 flex flex-1 flex-col gap-2 overflow-y-auto px-4"
                >
                    {allTestCases.map((test, index) => (
                        <TestCard
                            test={test}
                            index={index}
                            key={`all-${index}`}
                            selected={isSelected('all', index)}
                            setSelected={() => toggleSelected('all', index)}
                            onDuplicate={() => duplicateTestCase(index, 'all')}
                            onRemove={() => removeTestCase(index, 'all')}
                            onUpdate={(field, value) => updateTestCase(index, 'all', field, value)}
                            onToggle={() => toggleTestCaseVisibility(index, 'all')}
                            isPrivate={index >= publicTestCases.length}
                            isSaving={isSaving}
                        />
                    ))}
                </TabsContent>

                <TabsContent
                    value="public"
                    className="flex flex-1 flex-col gap-2 overflow-y-auto px-4"
                >
                    {publicTestCases.map((test, index) => (
                        <TestCard
                            test={test}
                            index={index}
                            key={`public-${index}`}
                            selected={isSelected('public', index)}
                            setSelected={() => toggleSelected('public', index)}
                            onDuplicate={() => duplicateTestCase(index, 'public')}
                            onRemove={() => removeTestCase(index, 'public')}
                            onUpdate={(field, value) =>
                                updateTestCase(index, 'public', field, value)
                            }
                            onToggle={() => toggleTestCaseVisibility(index, 'public')}
                            isPrivate={false}
                            isSaving={isSaving}
                        />
                    ))}
                </TabsContent>

                <TabsContent
                    value="private"
                    className="flex flex-1 flex-col gap-2 overflow-y-auto px-4"
                >
                    {privateTestCases.map((test, index) => (
                        <TestCard
                            test={test}
                            index={index}
                            key={`private-${index}`}
                            selected={isSelected('private', index)}
                            setSelected={() => toggleSelected('private', index)}
                            onDuplicate={() => duplicateTestCase(index, 'private')}
                            onRemove={() => removeTestCase(index, 'private')}
                            onUpdate={(field, value) =>
                                updateTestCase(index, 'private', field, value)
                            }
                            onToggle={() => toggleTestCaseVisibility(index, 'private')}
                            isPrivate={true}
                            isSaving={isSaving}
                        />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
