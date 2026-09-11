import { ProgrammingLanguage, TestVisibility } from '@/generated/prisma';

const carterTwoSumSubmission = `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    nums = list(map(int, _lines[0].split()))
    target = int(_lines[1])
    result = two_sum(nums, target)
    print(' '.join(str(x) for x in result))`;

const carterReverseStringSubmission = `def reverse_string(s):
    s.reverse()
    return s

# Do not edit below
import sys

if __name__ == "__main__":
    s = sys.stdin.read().split()
    reverse_string(s)
    print(' '.join(s))`;

const carterPalindromeSubmission = `def is_palindrome(s):
    cleaned = ''
    for c in s:
        if c.isalnum():
            cleaned += c.lower()
    if len(cleaned) == 0:
        return False
    return cleaned == cleaned[::-1]

# Do not edit below
import sys

if __name__ == "__main__":
    s = sys.stdin.readline().rstrip('\\n')
    print('true' if is_palindrome(s) else 'false')`;

export const tasksData = [
    {
        id: 'task_carter_two_sum_001',
        assessmentId: 'assessment_carter_001',
        taskTemplateId: 'task_template_two_sum_001',
        submission: carterTwoSumSubmission,
        language: ProgrammingLanguage.python,
        startedAt: new Date('2026-04-12T15:00:00Z'),
        submittedAt: new Date('2026-04-12T15:45:00Z'),
        testResults: [
            {
                visibility: TestVisibility.PUBLIC,
                passed: true,
                input: '2 7 11 15\\n9',
                expectedOutput: '0 1',
                actualOutput: '0 1',
            },
            {
                visibility: TestVisibility.PUBLIC,
                passed: true,
                input: '3 2 4\\n6',
                expectedOutput: '1 2',
                actualOutput: '1 2',
            },
            {
                visibility: TestVisibility.PUBLIC,
                passed: true,
                input: '3 3\\n6',
                expectedOutput: '0 1',
                actualOutput: '0 1',
            },
            {
                visibility: TestVisibility.PUBLIC,
                passed: true,
                input: '1 5 3 7 9\\n10',
                expectedOutput: '2 3',
                actualOutput: '2 3',
            },
            {
                visibility: TestVisibility.PRIVATE,
                passed: true,
                input: '0 4 3 0\\n0',
                expectedOutput: '0 3',
                actualOutput: '0 3',
            },
            {
                visibility: TestVisibility.PRIVATE,
                passed: true,
                input: '-1 -2 -3 -4\\n-6',
                expectedOutput: '1 3',
                actualOutput: '1 3',
            },
            {
                visibility: TestVisibility.PRIVATE,
                passed: true,
                input: '5 75 25\\n100',
                expectedOutput: '1 2',
                actualOutput: '1 2',
            },
        ],
    },
    {
        id: 'task_carter_reverse_string_001',
        assessmentId: 'assessment_carter_001',
        taskTemplateId: 'task_template_reverse_string_001',
        submission: carterReverseStringSubmission,
        language: ProgrammingLanguage.python,
        startedAt: new Date('2026-04-12T15:45:30Z'),
        submittedAt: new Date('2026-04-12T16:10:00Z'),
        testResults: [
            // public
            {
                visibility: TestVisibility.PUBLIC,
                passed: true,
                input: 'h e l l o',
                expectedOutput: 'o l l e h',
                actualOutput: 'o l l e h',
            },
            {
                visibility: TestVisibility.PUBLIC,
                passed: true,
                input: 'H a n n a h',
                expectedOutput: 'h a n n a H',
                actualOutput: 'h a n n a H',
            },
            {
                visibility: TestVisibility.PUBLIC,
                passed: true,
                input: 'A',
                expectedOutput: 'A',
                actualOutput: 'A',
            },
            // private (correct solution -> all pass)
            {
                visibility: TestVisibility.PRIVATE,
                passed: true,
                input: 'a b',
                expectedOutput: 'b a',
                actualOutput: 'b a',
            },
            {
                visibility: TestVisibility.PRIVATE,
                passed: true,
                input: '1 2 3',
                expectedOutput: '3 2 1',
                actualOutput: '3 2 1',
            },
        ],
    },
    {
        id: 'task_carter_palindrome_001',
        assessmentId: 'assessment_carter_001',
        taskTemplateId: 'task_template_palindrome_001',
        submission: carterPalindromeSubmission,
        language: ProgrammingLanguage.python,
        startedAt: new Date('2026-04-12T16:10:30Z'),
        submittedAt: new Date('2026-04-12T17:28:00Z'),
        testResults: [
            {
                visibility: TestVisibility.PUBLIC,
                passed: true,
                input: 'A man, a plan, a canal: Panama',
                expectedOutput: 'true',
                actualOutput: 'true',
            },
            {
                visibility: TestVisibility.PUBLIC,
                passed: true,
                input: 'race a car',
                expectedOutput: 'false',
                actualOutput: 'false',
            },
            {
                visibility: TestVisibility.PUBLIC,
                passed: true,
                input: 'Was it a car or a cat I saw?',
                expectedOutput: 'true',
                actualOutput: 'true',
            },
            {
                visibility: TestVisibility.PUBLIC,
                passed: false,
                input: ' ',
                expectedOutput: 'true',
                actualOutput: 'false',
            },
            {
                visibility: TestVisibility.PRIVATE,
                passed: true,
                input: 'racecar',
                expectedOutput: 'true',
                actualOutput: 'true',
            },
            {
                visibility: TestVisibility.PRIVATE,
                passed: true,
                input: 'hello',
                expectedOutput: 'false',
                actualOutput: 'false',
            },
            {
                visibility: TestVisibility.PRIVATE,
                passed: true,
                input: 'Able was I ere I saw Elba',
                expectedOutput: 'true',
                actualOutput: 'true',
            },
            {
                visibility: TestVisibility.PRIVATE,
                passed: false,
                input: '',
                expectedOutput: 'true',
                actualOutput: 'false',
            },
            {
                visibility: TestVisibility.PRIVATE,
                passed: false,
                input: '.',
                expectedOutput: 'true',
                actualOutput: 'false',
            },
            {
                visibility: TestVisibility.PRIVATE,
                passed: false,
                input: ',,',
                expectedOutput: 'true',
                actualOutput: 'false',
            },
        ],
    },
];
