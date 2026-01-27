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
    },
    {
        id: 'task_template_contains_duplicate_001',
        title: 'Contains Duplicate',
        content: `Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.

Example 1:
Input: nums = [1,2,3,1]
Output: true

Example 2:
Input: nums = [1,2,3,4]
Output: false

Example 3:
Input: nums = [99,99]
Output: true

Constraints:
- 1 <= nums.length <= 10^5
- -10^9 <= nums[i] <= 10^9`,
        publicTestCases: [
            {
                input: { nums: [1, 2, 3, 1] },
                expected: true,
            },
            {
                input: { nums: [1, 2, 3, 4] },
                expected: false,
            },
        ],
        privateTestCases: [
            {
                input: { nums: [99, 99] },
                expected: true,
            },
            {
                input: { nums: [1, 2, 3, 4, 5] },
                expected: false,
            },
        ],
        orgId: 'org_nextlab_001',
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
- s consists of parentheses only '()[]{}' `,
        publicTestCases: [
            {
                input: { s: '()' },
                expected: true,
            },
            {
                input: { s: '()[]{}' },
                expected: true,
            },
        ],
        privateTestCases: [
            {
                input: { s: '(]' },
                expected: false,
            },
            {
                input: { s: '({[]})' },
                expected: true,
            },
        ],
        orgId: 'org_nextlab_001',
    },
    {
        id: 'task_template_merge_sorted_arrays_001',
        title: 'Merge Sorted Array',
        content: `You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of valid elements in nums1 and nums2 respectively.

Merge nums2 into nums1 as one sorted array. The final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, with the last n elements set to 0 and should be ignored. nums2 has a length of n.

Example 1:
Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
Output: [1,2,2,3,5,6]

Example 2:
Input: nums1 = [1], m = 1, nums2 = [], n = 0
Output: [1]

Constraints:
- nums1.length == m + n
- nums2.length == n
- 0 <= m, n <= 200
- 1 <= m + n <= 200
- -10^9 <= nums1[i], nums2[j] <= 10^9`,
        publicTestCases: [
            {
                input: { nums1: [1, 2, 3, 0, 0, 0], m: 3, nums2: [2, 5, 6], n: 3 },
                expected: [1, 2, 2, 3, 5, 6],
            },
            {
                input: { nums1: [1], m: 1, nums2: [], n: 0 },
                expected: [1],
            },
        ],
        privateTestCases: [
            {
                input: { nums1: [4, 5, 6, 0, 0, 0], m: 3, nums2: [1, 2, 3], n: 3 },
                expected: [1, 2, 3, 4, 5, 6],
            },
            {
                input: { nums1: [0], m: 0, nums2: [1], n: 1 },
                expected: [1],
            },
        ],
        orgId: 'org_nextlab_001',
    },
    {
        id: 'task_template_majority_element_001',
        title: 'Majority Element',
        content: `Given an array nums of size n, return the majority element.

The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.

Example 1:
Input: nums = [3,2,3]
Output: 3

Example 2:
Input: nums = [2,2,1,1,1,2,2]
Output: 2

Constraints:
- n == nums.length
- 1 <= n <= 5 * 10^4
- -10^9 <= nums[i] <= 10^9

Follow-up: Could you solve the problem in linear time and in O(1) space?`,
        publicTestCases: [
            {
                input: { nums: [3, 2, 3] },
                expected: 3,
            },
            {
                input: { nums: [2, 2, 1, 1, 1, 2, 2] },
                expected: 2,
            },
        ],
        privateTestCases: [
            {
                input: { nums: [1] },
                expected: 1,
            },
            {
                input: { nums: [2, 1, 1, 1, 4, 5, 8] },
                expected: 1,
            },
        ],
        orgId: 'org_nextlab_001',
    },
    {
        id: 'task_template_single_number_001',
        title: 'Single Number',
        content: `Given a non-empty array of integers nums, every element appears twice except for one element that appears once. Find that single element.

You must implement a solution with a linear runtime complexity and use only constant extra space.

Example 1:
Input: nums = [2,2,1]
Output: 1

Example 2:
Input: nums = [4,1,2,1,2]
Output: 4

Example 3:
Input: nums = [1]
Output: 1

Constraints:
- 1 <= nums.length <= 3 * 10^4
- Each element in the array appears twice except for one element which appears only once.`,
        publicTestCases: [
            {
                input: { nums: [2, 2, 1] },
                expected: 1,
            },
            {
                input: { nums: [4, 1, 2, 1, 2] },
                expected: 4,
            },
        ],
        privateTestCases: [
            {
                input: { nums: [1] },
                expected: 1,
            },
            {
                input: { nums: [3, 3, 5, 5, 7] },
                expected: 7,
            },
        ],
        orgId: 'org_nextlab_001',
    },
];
