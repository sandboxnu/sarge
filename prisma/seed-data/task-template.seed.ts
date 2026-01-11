export const taskTemplatesData = [
    {
        id: 'task_template_two_sum_001',
        title: 'Two Sum',
        description: [
            {
                id: 'two_sum_p1',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    { type: 'text', text: 'Given an array of integers ', styles: {} },
                    { type: 'text', text: 'nums', styles: { code: true } },
                    { type: 'text', text: ' and an integer ', styles: {} },
                    { type: 'text', text: 'target', styles: { code: true } },
                    {
                        type: 'text',
                        text: ', return indices of the two numbers such that they add up to ',
                        styles: {},
                    },
                    { type: 'text', text: 'target', styles: { code: true } },
                    { type: 'text', text: '.', styles: {} },
                ],
                children: [],
            },
            {
                id: 'two_sum_p2',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    {
                        type: 'text',
                        text: 'You may assume that each input would have ',
                        styles: {},
                    },
                    { type: 'text', text: 'exactly one solution', styles: { bold: true } },
                    {
                        type: 'text',
                        text: ', and you may not use the same element twice.',
                        styles: {},
                    },
                ],
                children: [],
            },
            {
                id: 'two_sum_p3',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    { type: 'text', text: 'You can return the answer in any order.', styles: {} },
                ],
                children: [],
            },
            {
                id: 'two_sum_h1',
                type: 'heading',
                props: {
                    textColor: 'default',
                    backgroundColor: 'default',
                    textAlignment: 'left',
                    level: 2,
                },
                content: [{ type: 'text', text: 'Example 1', styles: { bold: true } }],
                children: [],
            },
            {
                id: 'two_sum_ex1_input',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    { type: 'text', text: 'Input: ', styles: {} },
                    {
                        type: 'text',
                        text: 'nums = [2,7,11,15], target = 9',
                        styles: { code: true },
                    },
                ],
                children: [],
            },
            {
                id: 'two_sum_ex1_output',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    { type: 'text', text: 'Output: ', styles: {} },
                    { type: 'text', text: '[0,1]', styles: { code: true } },
                ],
                children: [],
            },
            {
                id: 'two_sum_ex1_exp',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    {
                        type: 'text',
                        text: 'Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
                        styles: {},
                    },
                ],
                children: [],
            },
        ],
        publicTestCases: [
            { input: '[2,7,11,15], 9', output: '[0,1]' },
            { input: '[3,2,4], 6', output: '[1,2]' },
            { input: '[3,3], 6', output: '[0,1]' },
        ],
        privateTestCases: [
            { input: '[1,2,3,4,5], 9', output: '[3,4]' },
            { input: '[-1,-2,-3,-4,-5], -8', output: '[2,4]' },
        ],
        tagIds: ['tag_algorithm_001', 'tag_array_001'],
        starterCodes: [
            {
                language: 'python',
                code: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your code here
    pass`,
            },
            {
                language: 'javascript',
                code: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here
}`,
            },
        ],
    },
    {
        id: 'task_template_reverse_string_001',
        title: 'Reverse String',
        description: [
            {
                id: 'rs_p1',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    {
                        type: 'text',
                        text: 'Write a function that reverses a string. The input string is given as an array of characters ',
                        styles: {},
                    },
                    { type: 'text', text: 's', styles: { code: true } },
                    { type: 'text', text: '.', styles: {} },
                ],
                children: [],
            },
            {
                id: 'rs_p2',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    {
                        type: 'text',
                        text: 'You must do this by modifying the input array ',
                        styles: {},
                    },
                    { type: 'text', text: 'in-place', styles: { bold: true } },
                    { type: 'text', text: ' with O(1) extra memory.', styles: {} },
                ],
                children: [],
            },
            {
                id: 'rs_h1',
                type: 'heading',
                props: {
                    textColor: 'default',
                    backgroundColor: 'default',
                    textAlignment: 'left',
                    level: 2,
                },
                content: [{ type: 'text', text: 'Example 1', styles: { bold: true } }],
                children: [],
            },
            {
                id: 'rs_ex1_input',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    { type: 'text', text: 'Input: ', styles: {} },
                    { type: 'text', text: 's = ["h","e","l","l","o"]', styles: { code: true } },
                ],
                children: [],
            },
            {
                id: 'rs_ex1_output',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    { type: 'text', text: 'Output: ', styles: {} },
                    { type: 'text', text: '["o","l","l","e","h"]', styles: { code: true } },
                ],
                children: [],
            },
        ],
        publicTestCases: [
            { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
            { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
        ],
        privateTestCases: [
            { input: '["a"]', output: '["a"]' },
            { input: '["a","b"]', output: '["b","a"]' },
        ],
        tagIds: ['tag_string_001', 'tag_array_001'],
        starterCodes: [
            {
                language: 'python',
                code: `def reverse_string(s):
    """
    :type s: List[str]
    :rtype: None Do not return anything, modify s in-place instead.
    """
    # Your code here
    pass`,
            },
            {
                language: 'javascript',
                code: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
    // Your code here
}`,
            },
        ],
    },
    {
        id: 'task_template_fibonacci_001',
        title: 'Fibonacci Number',
        description: [
            {
                id: 'fib_p1',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    { type: 'text', text: 'The ', styles: {} },
                    { type: 'text', text: 'Fibonacci numbers', styles: { bold: true } },
                    {
                        type: 'text',
                        text: ', commonly denoted F(n) form a sequence, called the ',
                        styles: {},
                    },
                    { type: 'text', text: 'Fibonacci sequence', styles: { bold: true } },
                    {
                        type: 'text',
                        text: ', such that each number is the sum of the two preceding ones, starting from 0 and 1.',
                        styles: {},
                    },
                ],
                children: [],
            },
            {
                id: 'fib_p2',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [{ type: 'text', text: 'F(0) = 0, F(1) = 1', styles: { code: true } }],
                children: [],
            },
            {
                id: 'fib_p3',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    {
                        type: 'text',
                        text: 'F(n) = F(n - 1) + F(n - 2), for n > 1.',
                        styles: { code: true },
                    },
                ],
                children: [],
            },
            {
                id: 'fib_p4',
                type: 'paragraph',
                props: { textColor: 'default', backgroundColor: 'default', textAlignment: 'left' },
                content: [
                    { type: 'text', text: 'Given ', styles: {} },
                    { type: 'text', text: 'n', styles: { code: true } },
                    { type: 'text', text: ', calculate ', styles: {} },
                    { type: 'text', text: 'F(n)', styles: { code: true } },
                    { type: 'text', text: '.', styles: {} },
                ],
                children: [],
            },
        ],
        publicTestCases: [
            { input: '2', output: '1' },
            { input: '3', output: '2' },
            { input: '4', output: '3' },
        ],
        privateTestCases: [
            { input: '0', output: '0' },
            { input: '1', output: '1' },
            { input: '10', output: '55' },
        ],
        tagIds: ['tag_recursion_001', 'tag_algorithm_001'],
        starterCodes: [
            {
                language: 'python',
                code: `def fib(n):
    """
    :type n: int
    :rtype: int
    """
    # Your code here
    pass`,
            },
            {
                language: 'javascript',
                code: `/**
 * @param {number} n
 * @return {number}
 */
function fib(n) {
    // Your code here
}`,
            },
        ],
    },
];
