import { ProgrammingLanguage } from '@/generated/prisma';

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
    # Off-by-one: candidate forgot to handle empty input as a valid palindrome
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
        passedTestCases: [
            { input: '2 7 11 15\\n9', output: '0 1', actualOutput: '0 1' },
            { input: '3 2 4\\n6', output: '1 2', actualOutput: '1 2' },
            { input: '3 3\\n6', output: '0 1', actualOutput: '0 1' },
            { input: '1 5 3 7 9\\n10', output: '2 3', actualOutput: '2 3' },
        ],
        failedTestCases: [],
        startedAt: new Date('2026-04-12T15:00:00Z'),
        submittedAt: new Date('2026-04-12T15:45:00Z'),
    },
    {
        id: 'task_carter_reverse_string_001',
        assessmentId: 'assessment_carter_001',
        taskTemplateId: 'task_template_reverse_string_001',
        submission: carterReverseStringSubmission,
        language: ProgrammingLanguage.python,
        passedTestCases: [
            { input: 'h e l l o', output: 'o l l e h', actualOutput: 'o l l e h' },
            { input: 'H a n n a h', output: 'h a n n a H', actualOutput: 'h a n n a H' },
            { input: 'A', output: 'A', actualOutput: 'A' },
        ],
        failedTestCases: [],
        startedAt: new Date('2026-04-12T15:45:30Z'),
        submittedAt: new Date('2026-04-12T16:10:00Z'),
    },
    {
        id: 'task_carter_palindrome_001',
        assessmentId: 'assessment_carter_001',
        taskTemplateId: 'task_template_palindrome_001',
        submission: carterPalindromeSubmission,
        language: ProgrammingLanguage.python,
        passedTestCases: [
            {
                input: 'A man, a plan, a canal: Panama',
                output: 'true',
                actualOutput: 'true',
            },
            { input: 'race a car', output: 'false', actualOutput: 'false' },
            {
                input: 'Was it a car or a cat I saw?',
                output: 'true',
                actualOutput: 'true',
            },
        ],
        failedTestCases: [{ input: ' ', output: 'true', actualOutput: 'false' }],
        startedAt: new Date('2026-04-12T16:10:30Z'),
        submittedAt: new Date('2026-04-12T17:28:00Z'),
    },
];
