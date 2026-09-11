import type { SnapshotType } from '@/generated/prisma';

type SeedSnapshot = {
    id: string;
    taskId: string;
    type: SnapshotType;
    content?: string;
    createdAt: Date;
};

// Two Sum - Carter
const twoSumBoilerplate = `# Do not edit below
import sys

if __name__ == "__main__":
    _lines = sys.stdin.read().split('\\n')
    nums = list(map(int, _lines[0].split()))
    target = int(_lines[1])
    result = two_sum(nums, target)
    print(' '.join(str(x) for x in result))`;

const twoSumStage1 = `def two_sum(nums, target):
    pass

${twoSumBoilerplate}`;

const twoSumStage2 = `def two_sum(nums, target):
    # TODO: brute force first, then optimize
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            pass
    return []

${twoSumBoilerplate}`;

const twoSumStage3 = `def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

${twoSumBoilerplate}`;

const twoSumStage4 = `def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]
    return []

${twoSumBoilerplate}`;

const twoSumStage5 = `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
    return []

${twoSumBoilerplate}`;

const twoSumStage6 = `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

${twoSumBoilerplate}`;

// Final state matches tasks.seed.ts submission exactly.
const twoSumFinal = `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

${twoSumBoilerplate}`;

// Reverse String — Carter
const reverseBoilerplate = `# Do not edit below
import sys

if __name__ == "__main__":
    s = sys.stdin.read().split()
    reverse_string(s)
    print(' '.join(s))`;

const reverseStage1 = `def reverse_string(s):
    return s[::-1]

${reverseBoilerplate}`;

const reverseStage2 = `def reverse_string(s):
    s = s[::-1]
    return s

${reverseBoilerplate}`;

const reverseStage3 = `def reverse_string(s):
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1
    return s

${reverseBoilerplate}`;

const reverseFinal = `def reverse_string(s):
    s.reverse()
    return s

${reverseBoilerplate}`;

// Valid Palindrome — Carter
const palindromeBoilerplate = `# Do not edit below
import sys

if __name__ == "__main__":
    s = sys.stdin.readline().rstrip('\\n')
    print('true' if is_palindrome(s) else 'false')`;

const palindromeStage1 = `def is_palindrome(s):
    return s == s[::-1]

${palindromeBoilerplate}`;

const palindromeStage2 = `def is_palindrome(s):
    cleaned = s.lower()
    return cleaned == cleaned[::-1]

${palindromeBoilerplate}`;

const palindromeStage3 = `def is_palindrome(s):
    cleaned = ''.join(c for c in s if c.isalnum()).lower()
    return cleaned == cleaned[::-1]

${palindromeBoilerplate}`;

const palindromeStage4 = `def is_palindrome(s):
    cleaned = ''
    for c in s:
        if c.isalnum():
            cleaned += c.lower()
    return cleaned == cleaned[::-1]

${palindromeBoilerplate}`;

const palindromeStage5 = `def is_palindrome(s):
    cleaned = ''
    for c in s:
        if c.isalnum():
            cleaned += c.lower()
    if not cleaned:
        return False
    return cleaned == cleaned[::-1]

${palindromeBoilerplate}`;

const palindromeStage6 = `def is_palindrome(s):
    cleaned = ''
    for c in s:
        if c.isalnum():
            cleaned += c.lower()
    if len(cleaned) == 0:
        return False
    return cleaned == cleaned[::-1]

${palindromeBoilerplate}`;

const palindromeFinal = palindromeStage6;

export const snapshotsData: SeedSnapshot[] = [
    // ---- Task 1: Two Sum (15:00 → 15:45) ----
    {
        id: 'snap_carter_two_sum_001',
        taskId: 'task_carter_two_sum_001',
        type: 'META',
        createdAt: new Date('2026-04-12T15:00:00Z'),
    },
    {
        id: 'snap_carter_two_sum_002',
        taskId: 'task_carter_two_sum_001',
        type: 'CONTENT',
        content: twoSumStage1,
        createdAt: new Date('2026-04-12T15:02:30Z'),
    },
    {
        id: 'snap_carter_two_sum_003',
        taskId: 'task_carter_two_sum_001',
        type: 'CONTENT',
        content: twoSumStage2,
        createdAt: new Date('2026-04-12T15:04:10Z'),
    },
    {
        id: 'snap_carter_two_sum_004',
        taskId: 'task_carter_two_sum_001',
        type: 'COPYPASTE',
        createdAt: new Date('2026-04-12T15:08:00Z'),
    },
    {
        id: 'snap_carter_two_sum_005',
        taskId: 'task_carter_two_sum_001',
        type: 'CONTENT',
        content: twoSumStage3,
        createdAt: new Date('2026-04-12T15:09:30Z'),
    },
    {
        id: 'snap_carter_two_sum_006',
        taskId: 'task_carter_two_sum_001',
        type: 'CONTENT',
        content: twoSumStage4,
        createdAt: new Date('2026-04-12T15:15:20Z'),
    },
    {
        id: 'snap_carter_two_sum_007',
        taskId: 'task_carter_two_sum_001',
        type: 'HIGHLIGHT',
        createdAt: new Date('2026-04-12T15:25:00Z'),
    },
    {
        id: 'snap_carter_two_sum_008',
        taskId: 'task_carter_two_sum_001',
        type: 'CONTENT',
        content: twoSumStage5,
        createdAt: new Date('2026-04-12T15:30:00Z'),
    },
    {
        id: 'snap_carter_two_sum_009',
        taskId: 'task_carter_two_sum_001',
        type: 'DISCONNECT',
        createdAt: new Date('2026-04-12T15:38:00Z'),
    },
    {
        id: 'snap_carter_two_sum_010',
        taskId: 'task_carter_two_sum_001',
        type: 'CONTENT',
        content: twoSumStage6,
        createdAt: new Date('2026-04-12T15:40:00Z'),
    },
    {
        id: 'snap_carter_two_sum_011',
        taskId: 'task_carter_two_sum_001',
        type: 'CONTENT',
        content: twoSumFinal,
        createdAt: new Date('2026-04-12T15:44:30Z'),
    },
    {
        id: 'snap_carter_two_sum_012',
        taskId: 'task_carter_two_sum_001',
        type: 'META',
        createdAt: new Date('2026-04-12T15:45:00Z'),
    },

    // ---- Task 2: Reverse String (15:45 → 16:10) ----
    {
        id: 'snap_carter_reverse_001',
        taskId: 'task_carter_reverse_string_001',
        type: 'META',
        createdAt: new Date('2026-04-12T15:45:30Z'),
    },
    {
        id: 'snap_carter_reverse_002',
        taskId: 'task_carter_reverse_string_001',
        type: 'CONTENT',
        content: reverseStage1,
        createdAt: new Date('2026-04-12T15:47:00Z'),
    },
    {
        id: 'snap_carter_reverse_003',
        taskId: 'task_carter_reverse_string_001',
        type: 'CONTENT',
        content: reverseStage2,
        createdAt: new Date('2026-04-12T15:50:00Z'),
    },
    {
        id: 'snap_carter_reverse_004',
        taskId: 'task_carter_reverse_string_001',
        type: 'CONTENT',
        content: reverseStage3,
        createdAt: new Date('2026-04-12T15:58:00Z'),
    },
    {
        id: 'snap_carter_reverse_005',
        taskId: 'task_carter_reverse_string_001',
        type: 'HIGHLIGHT',
        createdAt: new Date('2026-04-12T16:04:00Z'),
    },
    {
        id: 'snap_carter_reverse_006',
        taskId: 'task_carter_reverse_string_001',
        type: 'CONTENT',
        content: reverseFinal,
        createdAt: new Date('2026-04-12T16:09:30Z'),
    },
    {
        id: 'snap_carter_reverse_007',
        taskId: 'task_carter_reverse_string_001',
        type: 'META',
        createdAt: new Date('2026-04-12T16:10:00Z'),
    },

    // ---- Task 3: Valid Palindrome (16:10 → 17:28) ----
    {
        id: 'snap_carter_palindrome_001',
        taskId: 'task_carter_palindrome_001',
        type: 'META',
        createdAt: new Date('2026-04-12T16:10:30Z'),
    },
    {
        id: 'snap_carter_palindrome_002',
        taskId: 'task_carter_palindrome_001',
        type: 'CONTENT',
        content: palindromeStage1,
        createdAt: new Date('2026-04-12T16:14:00Z'),
    },
    {
        id: 'snap_carter_palindrome_003',
        taskId: 'task_carter_palindrome_001',
        type: 'CONTENT',
        content: palindromeStage2,
        createdAt: new Date('2026-04-12T16:21:00Z'),
    },
    {
        id: 'snap_carter_palindrome_004',
        taskId: 'task_carter_palindrome_001',
        type: 'COPYPASTE',
        createdAt: new Date('2026-04-12T16:30:00Z'),
    },
    {
        id: 'snap_carter_palindrome_005',
        taskId: 'task_carter_palindrome_001',
        type: 'CONTENT',
        content: palindromeStage3,
        createdAt: new Date('2026-04-12T16:32:00Z'),
    },
    {
        id: 'snap_carter_palindrome_006',
        taskId: 'task_carter_palindrome_001',
        type: 'DISCONNECT',
        createdAt: new Date('2026-04-12T16:45:00Z'),
    },
    {
        id: 'snap_carter_palindrome_007',
        taskId: 'task_carter_palindrome_001',
        type: 'CONTENT',
        content: palindromeStage4,
        createdAt: new Date('2026-04-12T16:48:00Z'),
    },
    {
        id: 'snap_carter_palindrome_008',
        taskId: 'task_carter_palindrome_001',
        type: 'CONTENT',
        content: palindromeStage5,
        createdAt: new Date('2026-04-12T17:00:00Z'),
    },
    {
        id: 'snap_carter_palindrome_009',
        taskId: 'task_carter_palindrome_001',
        type: 'CONTENT',
        content: palindromeStage6,
        createdAt: new Date('2026-04-12T17:10:00Z'),
    },
    {
        id: 'snap_carter_palindrome_010',
        taskId: 'task_carter_palindrome_001',
        type: 'HIGHLIGHT',
        createdAt: new Date('2026-04-12T17:15:00Z'),
    },
    {
        id: 'snap_carter_palindrome_011',
        taskId: 'task_carter_palindrome_001',
        type: 'CONTENT',
        content: palindromeFinal,
        createdAt: new Date('2026-04-12T17:25:00Z'),
    },
    {
        id: 'snap_carter_palindrome_012',
        taskId: 'task_carter_palindrome_001',
        type: 'META',
        createdAt: new Date('2026-04-12T17:28:00Z'),
    },
];
