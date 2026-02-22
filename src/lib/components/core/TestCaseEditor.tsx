import TestCaseListShell from '@/lib/components/core/TestCaseListShell';
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
        <TestCaseListShell
            publicTestCases={publicTestCases}
            privateTestCases={privateTestCases}
            onDuplicate={duplicateTestCase}
            onRemove={removeTestCase}
            onUpdate={updateTestCase}
            onToggleVisibility={toggleTestCaseVisibility}
            headerAction={
                <Button
                    className="items-center gap-1 rounded-md px-3 py-1 text-sm"
                    variant="secondary"
                    onClick={addTestCase}
                >
                    <PlusIcon className="stroke-sarge-primary-500" height={18} width={18} />
                    Add test
                </Button>
            }
        />
    );
}
