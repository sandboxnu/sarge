export const taskTemplatesData = [
    {
        id: 'task_template_two_sum_001',
        title: 'Two Sum',
        content: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.

Example 1:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].

Example 2:
Input: nums = [3,2,4], target = 6
Output: [1,2]

Example 3:
Input: nums = [3,3], target = 6
Output: [0,1]

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.`,
        publicTestCases: [
            {
                input: { nums: [2, 7, 11, 15], target: 9 },
                expected: [0, 1],
            },
            {
                input: { nums: [3, 2, 4], target: 6 },
                expected: [1, 2],
            },
        ],
        privateTestCases: [
            {
                input: { nums: [3, 3], target: 6 },
                expected: [0, 1],
            },
            {
                input: { nums: [1, 5, 3, 7, 9], target: 10 },
                expected: [1, 3],
            },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',

        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_reverse_string_001',
        title: 'Reverse String',
        content: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

Example 1:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]

Example 2:
Input: s = ["H","a","n","n","a","h"]
Output: ["h","a","n","n","a","H"]

Constraints:
- 1 <= s.length <= 10^5
- s[i] is a printable ascii character.`,
        publicTestCases: [
            {
                input: { s: ['h', 'e', 'l', 'l', 'o'] },
                expected: ['o', 'l', 'l', 'e', 'h'],
            },
        ],
        privateTestCases: [
            {
                input: { s: ['H', 'a', 'n', 'n', 'a', 'h'] },
                expected: ['h', 'a', 'n', 'n', 'a', 'H'],
            },
            {
                input: { s: ['A'] },
                expected: ['A'],
            },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',

        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_palindrome_001',
        title: 'Valid Palindrome',
        content: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string s, return true if it is a palindrome, or false otherwise.

Example 1:
Input: s = "A man, a plan, a canal: Panama"
Output: true
Explanation: "amanaplanacanalpanama" is a palindrome.

Example 2:
Input: s = "race a car"
Output: false
Explanation: "raceacar" is not a palindrome.

Example 3:
Input: s = " "
Output: true
Explanation: s is an empty string "" after removing non-alphanumeric characters.
Since an empty string reads the same forward and backward, it is a palindrome.

Constraints:
- 1 <= s.length <= 2 * 10^5
- s consists only of printable ASCII characters.`,
        publicTestCases: [
            {
                input: { s: 'A man, a plan, a canal: Panama' },
                expected: true,
            },
            {
                input: { s: 'race a car' },
                expected: false,
            },
        ],
        privateTestCases: [
            {
                input: { s: ' ' },
                expected: true,
            },
            {
                input: { s: 'Was it a car or a cat I saw?' },
                expected: true,
            },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',

        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_fizzbuzz_001',
        title: 'Fizzbuzz',
        content: `Consider the following problem:
Write a short program that prints each number from 1 to 100 on a new line.
For each multiple of 3, print "Fizz" instead of the number.
For each multiple of 5, print "Buzz" instead of the number.
For numbers which are multiples of both 3 and 5, print "FizzBuzz" instead of the number.

Write a solution (or reduce an existing one) so it has as few characters as possible.`,
        publicTestCases: [{ input: {}, expected: null }],
        privateTestCases: [{ input: {}, expected: null }],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',

        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_quick_warmup_001',
        title: 'Quick Warmup',
        content: '',
        publicTestCases: [{ input: {}, expected: null }],
        privateTestCases: [],
        orgId: 'org_nextlab_001',
        taskType: null,

        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_max_subarray_001',
        title: 'Maximum Subarray',
        content: `Given an integer array nums, find the subarray with the largest sum, and return its sum.

Example 1:
Input: nums = [-2,1,-3,4,-1,2,1,-5,4]
Output: 6
Explanation: The subarray [4,-1,2,1] has the largest sum 6.

Example 2:
Input: nums = [1]
Output: 1

Example 3:
Input: nums = [5,4,-1,7,8]
Output: 23
Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.

Constraints:
- 1 <= nums.length <= 10^5
- -10^4 <= nums[i] <= 10^4`,
        publicTestCases: [
            { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
            { input: { nums: [1] }, expected: 1 },
        ],
        privateTestCases: [
            { input: { nums: [5, 4, -1, 7, 8] }, expected: 23 },
            { input: { nums: [-1, -2, -3] }, expected: -1 },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',

        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_binary_search_001',
        title: 'Binary Search',
        content: `Given a sorted array of integers nums and an integer target, find the index of target in nums. If target does not exist, return -1.

You must write an algorithm with O(log n) runtime complexity.

Example 1:
Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4.

Example 2:
Input: nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 does not exist in nums so return -1.

Constraints:
- 1 <= nums.length <= 10^4
- -10^4 < nums[i], target < 10^4
- nums is sorted in ascending order.`,
        publicTestCases: [
            { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expected: 4 },
            { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expected: -1 },
        ],
        privateTestCases: [
            { input: { nums: [5], target: 5 }, expected: 0 },
            { input: { nums: [2, 5], target: 5 }, expected: 1 },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',

        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_valid_parentheses_001',
        title: 'Valid Parentheses',
        content: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

Example 1:
Input: s = "()"
Output: true

Example 2:
Input: s = "()[]{}"
Output: true

Example 3:
Input: s = "(]"
Output: false

Constraints:
- 1 <= s.length <= 10^4
- s consists of parentheses only '()[]{}'.`,
        publicTestCases: [
            { input: { s: '()' }, expected: true },
            { input: { s: '()[]{}' }, expected: true },
            { input: { s: '(]' }, expected: false },
        ],
        privateTestCases: [
            { input: { s: '([)]' }, expected: false },
            { input: { s: '{[]}' }, expected: true },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',

        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_merge_sorted_001',
        title: 'Merge Two Sorted Lists',
        content: `You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.

Example 1:
Input: list1 = [1,2,4], list2 = [1,3,4]
Output: [1,1,2,3,4,4]

Example 2:
Input: list1 = [], list2 = []
Output: []

Example 3:
Input: list1 = [], list2 = [0]
Output: [0]

Constraints:
- The number of nodes in both lists is in the range [0, 50].
- -100 <= Node.val <= 100
- Both list1 and list2 are sorted in non-decreasing order.`,
        publicTestCases: [
            {
                input: { list1: [1, 2, 4], list2: [1, 3, 4] },
                expected: [1, 1, 2, 3, 4, 4],
            },
            { input: { list1: [], list2: [] }, expected: [] },
        ],
        privateTestCases: [
            { input: { list1: [], list2: [0] }, expected: [0] },
            { input: { list1: [1], list2: [2] }, expected: [1, 2] },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_longest_prefix_001',
        title: 'Longest Common Prefix',
        content: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string "".

Example 1:
Input: strs = ["flower","flow","flight"]
Output: "fl"

Example 2:
Input: strs = ["dog","racecar","car"]
Output: ""
Explanation: There is no common prefix among the input strings.

Constraints:
- 1 <= strs.length <= 200
- 0 <= strs[i].length <= 200
- strs[i] consists of only lowercase English letters.`,
        publicTestCases: [
            {
                input: { strs: ['flower', 'flow', 'flight'] },
                expected: 'fl',
            },
            {
                input: { strs: ['dog', 'racecar', 'car'] },
                expected: '',
            },
        ],
        privateTestCases: [
            { input: { strs: ['a'] }, expected: 'a' },
            { input: { strs: ['ab', 'a'] }, expected: 'a' },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',
        authorId: 'user_prof_fontenot_001',
    },
];
