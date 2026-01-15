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
];
