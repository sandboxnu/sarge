import TestCasePanel from '@/lib/components/core/TestCasePanel';
import { type TestCaseDTO } from '@/lib/schemas/task-template.schema';
import useTestCaseEditor from '@/lib/hooks/useTestCaseEditor';

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
            onAddTestCase={addTestCase}
            onDuplicateTestCase={duplicateTestCase}
            onRemoveTestCase={removeTestCase}
            onTestCaseUpdate={updateTestCase}
            onToggleTestCaseVisibility={toggleTestCaseVisibility}
        />
    );
}
