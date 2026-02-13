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
}

export default function TestCaseEditor(props: TestCaseEditorProps) {
    const { publicTestCases, setPublicTestCases, privateTestCases, setPrivateTestCases } = props;
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
    } = useTestCaseEditor(
        publicTestCases,
        setPublicTestCases,
        privateTestCases,
        setPrivateTestCases
    );

    return (
        <div className="flex flex-1 flex-col overflow-hidden p-4">
            <Tabs
                value={activeTestTab}
                onValueChange={(v) => setActiveTestTab(v as TestTab)}
                className="flex flex-1 flex-col overflow-hidden"
            >
                <div className="border-sarge-gray-200 shrink-0 border-b">
                    <TabsList className="h-auto gap-5 bg-transparent p-0 px-4">
                        <TabsTrigger value="all">
                            All Test Cases ({allTestCases.length})
                        </TabsTrigger>
                        <TabsTrigger value="public">
                            Public Test Cases ({publicTestCases.length})
                        </TabsTrigger>
                        <TabsTrigger value="private">
                            Private Test Cases ({privateTestCases.length})
                        </TabsTrigger>
                    </TabsList>
                </div>

                {/* Header */}
                <div className="my-3 flex shrink-0 items-center justify-between px-4">
                    <span className="text-md font-medium">
                        {activeLabel} ({activeTestCases.length})
                    </span>
                    <Button
                        className="text-sarge-gray-500 border-sarge-gray-500 flex items-center gap-1 rounded-lg border bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                        onClick={addTestCase}
                    >
                        <PlusIcon className="stroke-sarge-gray-500" height={18} width={18} />
                        Add test
                    </Button>
                </div>

                <TabsContent value="all" className="flex flex-1 flex-col gap-2 overflow-y-auto">
                    {allTestCases.map((test, index) => (
                        <TestCard
                            test={test}
                            index={index}
                            key={`all-${index}`}
                            selected={true}
                            setSelected={(i: number) => console.warn(i)}
                            onDuplicate={() => duplicateTestCase(index, 'all')}
                            onRemove={() => removeTestCase(index, 'all')}
                            onUpdate={(field, value) => updateTestCase(index, 'all', field, value)}
                            onToggle={() => toggleTestCaseVisibility(index, 'private')}
                            // because our tests themselves don't have a public or private state
                            // they're indexed in a way where they're not mixed and matched, but
                            // public test cases first, then private test cases after
                            isPrivate={index >= publicTestCases.length}
                        />
                    ))}
                </TabsContent>

                <TabsContent value="public" className="flex flex-1 flex-col gap-2 overflow-y-auto">
                    {publicTestCases.map((test, index) => (
                        <TestCard
                            test={test}
                            index={index}
                            key={`public-${index}`}
                            selected={true}
                            setSelected={(i: number) => console.warn(i)}
                            onDuplicate={() => duplicateTestCase(index, 'public')}
                            onRemove={() => removeTestCase(index, 'public')}
                            onUpdate={(field, value) =>
                                updateTestCase(index, 'public', field, value)
                            }
                            onToggle={() => toggleTestCaseVisibility(index, 'public')}
                            isPrivate={false}
                        />
                    ))}
                </TabsContent>

                <TabsContent value="private" className="flex flex-1 flex-col gap-2 overflow-y-auto">
                    {privateTestCases.map((test, index) => (
                        <TestCard
                            test={test}
                            index={index}
                            key={`private-${index}`}
                            selected={true}
                            setSelected={(i: number) => console.warn(i)}
                            onDuplicate={() => duplicateTestCase(index, 'private')}
                            onRemove={() => removeTestCase(index, 'private')}
                            onUpdate={(field, value) =>
                                updateTestCase(index, 'private', field, value)
                            }
                            onToggle={() => toggleTestCaseVisibility(index, 'private')}
                            isPrivate={true}
                        />
                    ))}
                </TabsContent>
            </Tabs>
        </div>
    );
}
