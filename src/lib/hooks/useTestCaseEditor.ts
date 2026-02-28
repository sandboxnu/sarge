import { type TestCaseDTO } from '@/lib/schemas/task-template.schema';

export type TestTab = 'all' | 'public' | 'private';

export default function useTestCaseEditor(
    publicTestCases: TestCaseDTO[],
    setPublicTestCases: React.Dispatch<React.SetStateAction<TestCaseDTO[]>>,
    privateTestCases: TestCaseDTO[],
    setPrivateTestCases: React.Dispatch<React.SetStateAction<TestCaseDTO[]>>
) {
    function addTestCase() {
        const newTest: TestCaseDTO = { input: '', output: '' };
        // adding a test case goes to private
        setPrivateTestCases((prev) => [...prev, newTest]);
    }

    function removeTestCase(index: number, tab: TestTab) {
        if (tab === 'all') {
            if (index < publicTestCases.length) {
                setPublicTestCases((prev) => prev.filter((_, i) => i !== index));
            } else {
                const privateIndex = index - publicTestCases.length;
                setPrivateTestCases((prev) => prev.filter((_, i) => i !== privateIndex));
            }
        } else if (tab === 'public') {
            setPublicTestCases((prev) => prev.filter((_, i) => i !== index));
        } else {
            setPrivateTestCases((prev) => prev.filter((_, i) => i !== index));
        }
    }

    function insertDuplicate(prev: TestCaseDTO[], i: number) {
        return [...prev.slice(0, i + 1), { ...prev[i] }, ...prev.slice(i + 1)];
    }

    function duplicateTestCase(index: number, tab: TestTab) {
        if (tab === 'all') {
            if (index < publicTestCases.length) {
                setPublicTestCases((prev) => insertDuplicate(prev, index));
            } else {
                const privateIndex = index - publicTestCases.length;
                setPrivateTestCases((prev) => insertDuplicate(prev, privateIndex));
            }
        } else if (tab === 'public') {
            setPublicTestCases((prev) => insertDuplicate(prev, index));
        } else {
            setPrivateTestCases((prev) => insertDuplicate(prev, index));
        }
    }

    function update(prev: TestCaseDTO[], i: number, field: 'input' | 'output', value: string) {
        return prev.map((t, idx) => (idx === i ? { ...t, [field]: value } : t));
    }

    function updateTestCase(index: number, tab: TestTab, field: 'input' | 'output', value: string) {
        if (tab === 'all') {
            if (index < publicTestCases.length) {
                setPublicTestCases((prev) => update(prev, index, field, value));
            } else {
                const privateIndex = index - publicTestCases.length;
                setPrivateTestCases((prev) => update(prev, privateIndex, field, value));
            }
        } else if (tab === 'public') {
            setPublicTestCases((prev) => update(prev, index, field, value));
        } else {
            setPrivateTestCases((prev) => update(prev, index, field, value));
        }
    }

    function toggleTestCaseVisibility(index: number, tab: TestTab) {
        if (tab === 'all') {
            if (index < publicTestCases.length) {
                const testCase = publicTestCases[index];
                setPublicTestCases((prev) => prev.filter((_, i) => i !== index));
                setPrivateTestCases((prev) => [...prev, testCase]);
            } else {
                const privateIndex = index - publicTestCases.length;
                const testCase = privateTestCases[privateIndex];
                setPrivateTestCases((prev) => prev.filter((_, i) => i !== privateIndex));
                setPublicTestCases((prev) => [...prev, testCase]);
            }
        } else if (tab === 'public') {
            const testCase = publicTestCases[index];
            setPublicTestCases((prev) => prev.filter((_, i) => i !== index));
            setPrivateTestCases((prev) => [...prev, testCase]);
        } else {
            const testCase = privateTestCases[index];
            setPrivateTestCases((prev) => prev.filter((_, i) => i !== index));
            setPublicTestCases((prev) => [...prev, testCase]);
        }
    }

    return {
        addTestCase,
        removeTestCase,
        duplicateTestCase,
        updateTestCase,
        toggleTestCaseVisibility,
    };
}
