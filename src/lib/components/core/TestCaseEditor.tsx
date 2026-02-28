import TestCasePanel from '@/lib/components/core/TestCasePanel';
import { Button } from '@/lib/components/ui/Button';
import { type TestCaseDTO } from '@/lib/schemas/task-template.schema';
import useTestCaseEditor from '@/lib/hooks/useTestCaseEditor';
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
        addTestCase,
        removeTestCase,
        duplicateTestCase,
        updateTestCase,
        toggleTestCaseVisibility,
    } = useTestCaseEditor(
        publicTestCases,
        setPublicTestCases,
        privateTestCases,
        setPrivateTestCases
    );

    return (
        <TestCasePanel
            publicTestCases={publicTestCases}
            privateTestCases={privateTestCases}
            isSaving={isSaving}
            onDuplicateTestCase={duplicateTestCase}
            onRemoveTestCase={removeTestCase}
            onTestCaseUpdate={updateTestCase}
            onToggleTestCaseVisibility={toggleTestCaseVisibility}
            headerAction={
                <Button
                    className="items-center gap-1 rounded-md px-3 py-1 text-sm"
                    variant="secondary"
                    onClick={addTestCase}
                    disabled={isSaving}
                >
                    <PlusIcon className="stroke-sarge-primary-500" height={18} width={18} />
                    Add test
                </Button>
            }
        />
    );
}
