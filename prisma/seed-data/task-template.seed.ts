// https://blocknotejs.org/docs/foundations/document-structure
const defaultProps = {
    textColor: 'default' as const,
    backgroundColor: 'default' as const,
    textAlignment: 'left' as const,
};

type InlineContentInput =
    | string
    | { text: string; bold?: boolean; code?: boolean; italic?: boolean };

function normalizeContent(c: InlineContentInput) {
    if (typeof c === 'string') {
        return { type: 'text' as const, text: c, styles: {} };
    }
    const { text, bold, code, italic } = c;
    const styles: Record<string, boolean> = {};
    if (bold) styles.bold = true;
    if (code) styles.code = true;
    if (italic) styles.italic = true;
    return { type: 'text' as const, text, styles };
}

function paragraph(id: string, content: InlineContentInput[]) {
    return {
        id,
        type: 'paragraph' as const,
        props: defaultProps,
        content: content.map(normalizeContent),
        children: [] as object[],
    };
}

function heading(id: string, level: 1 | 2 | 3, content: InlineContentInput[]) {
    return {
        id,
        type: 'heading' as const,
        props: { ...defaultProps, level },
        content: content.map(normalizeContent),
        children: [] as object[],
    };
}

export const taskTemplatesData = [
    {
        id: 'task_template_two_sum_001',
        title: 'Two Sum',
        description: [
            paragraph('two_sum_p1', [
                'Given an array of integers ',
                { text: 'nums', code: true },
                ' and an integer ',
                { text: 'target', code: true },
                ', return indices of the two numbers such that they add up to ',
                { text: 'target', code: true },
                '.',
            ]),
            paragraph('two_sum_p2', [
                'You may assume that each input would have ',
                { text: 'exactly one solution', bold: true },
                ', and you may not use the same element twice.',
            ]),
            paragraph('two_sum_p3', ['You can return the answer in any order.']),
            heading('two_sum_h1', 2, [{ text: 'Example 1', bold: true }]),
            paragraph('two_sum_ex1_input', [
                'Input: ',
                { text: 'nums = [2,7,11,15], target = 9', code: true },
            ]),
            paragraph('two_sum_ex1_output', ['Output: ', { text: '[0,1]', code: true }]),
            paragraph('two_sum_ex1_exp', [
                'Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
            ]),
            heading('two_sum_h2', 2, [{ text: 'Example 2', bold: true }]),
            paragraph('two_sum_ex2_input', [
                'Input: ',
                { text: 'nums = [3,2,4], target = 6', code: true },
            ]),
            paragraph('two_sum_ex2_output', ['Output: ', { text: '[1,2]', code: true }]),
            heading('two_sum_h3', 2, [{ text: 'Example 3', bold: true }]),
            paragraph('two_sum_ex3_input', [
                'Input: ',
                { text: 'nums = [3,3], target = 6', code: true },
            ]),
            paragraph('two_sum_ex3_output', ['Output: ', { text: '[0,1]', code: true }]),
            heading('two_sum_h4', 2, [{ text: 'Constraints', bold: true }]),
            paragraph('two_sum_c1', ['- 2 <= nums.length <= 10^4']),
            paragraph('two_sum_c2', ['- -10^9 <= nums[i] <= 10^9']),
            paragraph('two_sum_c3', ['- -10^9 <= target <= 10^9']),
            paragraph('two_sum_c4', ['- Only one valid answer exists.']),
        ],
        // stdin: first line is space-separated nums, second line is target
        // stdout: space-separated indices
        publicTestCases: [
            { input: '2 7 11 15\n9', output: '0 1' },
            { input: '3 2 4\n6', output: '1 2' },
        ],
        privateTestCases: [
            { input: '3 3\n6', output: '0 1' },
            { input: '1 5 3 7 9\n10', output: '1 3' },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_reverse_string_001',
        title: 'Reverse String',
        description: [
            paragraph('rs_p1', [
                'Write a function that reverses a string. The input string is given as an array of characters ',
                { text: 's', code: true },
                '.',
            ]),
            paragraph('rs_p2', [
                'You must do this by modifying the input array ',
                { text: 'in-place', bold: true },
                ' with O(1) extra memory.',
            ]),
            heading('rs_h1', 2, [{ text: 'Example 1', bold: true }]),
            paragraph('rs_ex1_input', [
                'Input: ',
                { text: 's = ["h","e","l","l","o"]', code: true },
            ]),
            paragraph('rs_ex1_output', ['Output: ', { text: '["o","l","l","e","h"]', code: true }]),
            heading('rs_h2', 2, [{ text: 'Example 2', bold: true }]),
            paragraph('rs_ex2_input', [
                'Input: ',
                { text: 's = ["H","a","n","n","a","h"]', code: true },
            ]),
            paragraph('rs_ex2_output', [
                'Output: ',
                { text: '["h","a","n","n","a","H"]', code: true },
            ]),
            heading('rs_h3', 2, [{ text: 'Constraints', bold: true }]),
            paragraph('rs_c1', ['- 1 <= s.length <= 10^5']),
            paragraph('rs_c2', ['- s[i] is a printable ascii character.']),
        ],
        // stdin: space-separated characters
        // stdout: space-separated reversed characters
        publicTestCases: [{ input: 'h e l l o', output: 'o l l e h' }],
        privateTestCases: [
            { input: 'H a n n a h', output: 'h a n n a H' },
            { input: 'A', output: 'A' },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_palindrome_001',
        title: 'Valid Palindrome',
        description: [
            paragraph('vp_p1', [
                'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.',
            ]),
            paragraph('vp_p2', [
                'Given a string ',
                { text: 's', code: true },
                ', return true if it is a palindrome, or false otherwise.',
            ]),
            heading('vp_h1', 2, [{ text: 'Example 1', bold: true }]),
            paragraph('vp_ex1_input', [
                'Input: ',
                { text: 's = "A man, a plan, a canal: Panama"', code: true },
            ]),
            paragraph('vp_ex1_output', ['Output: ', { text: 'true', code: true }]),
            paragraph('vp_ex1_exp', ['Explanation: "amanaplanacanalpanama" is a palindrome.']),
            heading('vp_h2', 2, [{ text: 'Example 2', bold: true }]),
            paragraph('vp_ex2_input', ['Input: ', { text: 's = "race a car"', code: true }]),
            paragraph('vp_ex2_output', ['Output: ', { text: 'false', code: true }]),
            paragraph('vp_ex2_exp', ['Explanation: "raceacar" is not a palindrome.']),
            heading('vp_h3', 2, [{ text: 'Example 3', bold: true }]),
            paragraph('vp_ex3_input', ['Input: ', { text: 's = " "', code: true }]),
            paragraph('vp_ex3_output', ['Output: ', { text: 'true', code: true }]),
            paragraph('vp_ex3_exp', [
                'Explanation: s is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.',
            ]),
            heading('vp_h4', 2, [{ text: 'Constraints', bold: true }]),
            paragraph('vp_c1', ['- 1 <= s.length <= 2 * 10^5']),
            paragraph('vp_c2', ['- s consists only of printable ASCII characters.']),
        ],
        // stdin: the string
        // stdout: true or false
        publicTestCases: [
            { input: 'A man, a plan, a canal: Panama', output: 'true' },
            { input: 'race a car', output: 'false' },
        ],
        privateTestCases: [
            { input: ' ', output: 'true' },
            { input: 'Was it a car or a cat I saw?', output: 'true' },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_fizzbuzz_001',
        title: 'Fizzbuzz',
        description: [
            paragraph('fizzbuzz_p1', ['Consider the following problem:']),
            paragraph('fizzbuzz_p2', [
                'Write a short program that prints each number from 1 to 100 on a new line.',
            ]),
            paragraph('fizzbuzz_p3', [
                'For each multiple of 3, print "Fizz" instead of the number.',
            ]),
            paragraph('fizzbuzz_p4', [
                'For each multiple of 5, print "Buzz" instead of the number.',
            ]),
            paragraph('fizzbuzz_p5', [
                'For numbers which are multiples of both 3 and 5, print "FizzBuzz" instead of the number.',
            ]),
            paragraph('fizzbuzz_p6', []),
            paragraph('fizzbuzz_p7', [
                'Write a solution (or reduce an existing one) so it has as few characters as possible.',
            ]),
        ],
        // stdin: empty — no input needed
        // stdout: fizzbuzz output from 1 to 100
        publicTestCases: [
            { input: '3', output: 'Fizz' },
            { input: '5', output: 'Buzz' },
            { input: '15', output: 'FizzBuzz' },
        ],
        privateTestCases: [
            { input: '1', output: '1' },
            { input: '9', output: 'Fizz' },
            { input: '10', output: 'Buzz' },
            { input: '30', output: 'FizzBuzz' },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_quick_warmup_001',
        title: 'Quick Warmup',
        description: [] as object[],
        publicTestCases: [{ input: '', output: '' }],
        privateTestCases: [],
        orgId: 'org_nextlab_001',
        taskType: null,
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_max_subarray_001',
        title: 'Maximum Subarray',
        description: [
            paragraph('ms_p1', [
                'Given an integer array ',
                { text: 'nums', code: true },
                ', find the subarray with the largest sum, and return its sum.',
            ]),
            heading('ms_h1', 2, [{ text: 'Example 1', bold: true }]),
            paragraph('ms_ex1_input', [
                'Input: ',
                { text: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', code: true },
            ]),
            paragraph('ms_ex1_output', ['Output: ', { text: '6', code: true }]),
            paragraph('ms_ex1_exp', [
                'Explanation: The subarray [4,-1,2,1] has the largest sum 6.',
            ]),
            heading('ms_h2', 2, [{ text: 'Example 2', bold: true }]),
            paragraph('ms_ex2_input', ['Input: ', { text: 'nums = [1]', code: true }]),
            paragraph('ms_ex2_output', ['Output: ', { text: '1', code: true }]),
            heading('ms_h3', 2, [{ text: 'Example 3', bold: true }]),
            paragraph('ms_ex3_input', ['Input: ', { text: 'nums = [5,4,-1,7,8]', code: true }]),
            paragraph('ms_ex3_output', ['Output: ', { text: '23', code: true }]),
            paragraph('ms_ex3_exp', [
                'Explanation: The subarray [5,4,-1,7,8] has the largest sum 23.',
            ]),
            heading('ms_h4', 2, [{ text: 'Constraints', bold: true }]),
            paragraph('ms_c1', ['- 1 <= nums.length <= 10^5']),
            paragraph('ms_c2', ['- -10^4 <= nums[i] <= 10^4']),
        ],
        // stdin: space-separated nums
        // stdout: the maximum subarray sum
        publicTestCases: [
            { input: '-2 1 -3 4 -1 2 1 -5 4', output: '6' },
            { input: '1', output: '1' },
        ],
        privateTestCases: [
            { input: '5 4 -1 7 8', output: '23' },
            { input: '-1 -2 -3', output: '-1' },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_binary_search_001',
        title: 'Binary Search',
        description: [
            paragraph('bs_p1', [
                'Given a sorted array of integers ',
                { text: 'nums', code: true },
                ' and an integer ',
                { text: 'target', code: true },
                ', find the index of target in nums. If target does not exist, return -1.',
            ]),
            paragraph('bs_p2', ['You must write an algorithm with O(log n) runtime complexity.']),
            heading('bs_h1', 2, [{ text: 'Example 1', bold: true }]),
            paragraph('bs_ex1_input', [
                'Input: ',
                { text: 'nums = [-1,0,3,5,9,12], target = 9', code: true },
            ]),
            paragraph('bs_ex1_output', ['Output: ', { text: '4', code: true }]),
            paragraph('bs_ex1_exp', ['Explanation: 9 exists in nums and its index is 4.']),
            heading('bs_h2', 2, [{ text: 'Example 2', bold: true }]),
            paragraph('bs_ex2_input', [
                'Input: ',
                { text: 'nums = [-1,0,3,5,9,12], target = 2', code: true },
            ]),
            paragraph('bs_ex2_output', ['Output: ', { text: '-1', code: true }]),
            paragraph('bs_ex2_exp', ['Explanation: 2 does not exist in nums so return -1.']),
            heading('bs_h3', 2, [{ text: 'Constraints', bold: true }]),
            paragraph('bs_c1', ['- 1 <= nums.length <= 10^4']),
            paragraph('bs_c2', ['- -10^4 < nums[i], target < 10^4']),
            paragraph('bs_c3', ['- nums is sorted in ascending order.']),
        ],
        // stdin: first line is space-separated nums, second line is target
        // stdout: the index, or -1
        publicTestCases: [
            { input: '-1 0 3 5 9 12\n9', output: '4' },
            { input: '-1 0 3 5 9 12\n2', output: '-1' },
        ],
        privateTestCases: [
            { input: '5\n5', output: '0' },
            { input: '2 5\n5', output: '1' },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_valid_parentheses_001',
        title: 'Valid Parentheses',
        description: [
            paragraph('vp2_p1', [
                'Given a string ',
                { text: 's', code: true },
                " containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
            ]),
            paragraph('vp2_p2', ['An input string is valid if:']),
            paragraph('vp2_p3', ['1. Open brackets must be closed by the same type of brackets.']),
            paragraph('vp2_p4', ['2. Open brackets must be closed in the correct order.']),
            paragraph('vp2_p5', [
                '3. Every close bracket has a corresponding open bracket of the same type.',
            ]),
            heading('vp2_h1', 2, [{ text: 'Example 1', bold: true }]),
            paragraph('vp2_ex1_input', ['Input: ', { text: 's = "()"', code: true }]),
            paragraph('vp2_ex1_output', ['Output: ', { text: 'true', code: true }]),
            heading('vp2_h2', 2, [{ text: 'Example 2', bold: true }]),
            paragraph('vp2_ex2_input', ['Input: ', { text: 's = "()[]{}"', code: true }]),
            paragraph('vp2_ex2_output', ['Output: ', { text: 'true', code: true }]),
            heading('vp2_h3', 2, [{ text: 'Example 3', bold: true }]),
            paragraph('vp2_ex3_input', ['Input: ', { text: 's = "(]"', code: true }]),
            paragraph('vp2_ex3_output', ['Output: ', { text: 'false', code: true }]),
            heading('vp2_h4', 2, [{ text: 'Constraints', bold: true }]),
            paragraph('vp2_c1', ['- 1 <= s.length <= 10^4']),
            paragraph('vp2_c2', ["- s consists of parentheses only '()[]{}'."]),
        ],
        // stdin: the bracket string
        // stdout: true or false
        publicTestCases: [
            { input: '()', output: 'true' },
            { input: '()[]{}', output: 'true' },
            { input: '(]', output: 'false' },
        ],
        privateTestCases: [
            { input: '([)]', output: 'false' },
            { input: '{[]}', output: 'true' },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_merge_sorted_001',
        title: 'Merge Two Sorted Lists',
        description: [
            paragraph('mts_p1', [
                'You are given the heads of two sorted linked lists ',
                { text: 'list1', code: true },
                ' and ',
                { text: 'list2', code: true },
                '.',
            ]),
            paragraph('mts_p2', [
                'Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.',
            ]),
            paragraph('mts_p3', ['Return the head of the merged linked list.']),
            heading('mts_h1', 2, [{ text: 'Example 1', bold: true }]),
            paragraph('mts_ex1_input', [
                'Input: ',
                { text: 'list1 = [1,2,4], list2 = [1,3,4]', code: true },
            ]),
            paragraph('mts_ex1_output', ['Output: ', { text: '[1,1,2,3,4,4]', code: true }]),
            heading('mts_h2', 2, [{ text: 'Example 2', bold: true }]),
            paragraph('mts_ex2_input', ['Input: ', { text: 'list1 = [], list2 = []', code: true }]),
            paragraph('mts_ex2_output', ['Output: ', { text: '[]', code: true }]),
            heading('mts_h3', 2, [{ text: 'Example 3', bold: true }]),
            paragraph('mts_ex3_input', [
                'Input: ',
                { text: 'list1 = [], list2 = [0]', code: true },
            ]),
            paragraph('mts_ex3_output', ['Output: ', { text: '[0]', code: true }]),
            heading('mts_h4', 2, [{ text: 'Constraints', bold: true }]),
            paragraph('mts_c1', ['- The number of nodes in both lists is in the range [0, 50].']),
            paragraph('mts_c2', ['- -100 <= Node.val <= 100']),
            paragraph('mts_c3', ['- Both list1 and list2 are sorted in non-decreasing order.']),
        ],
        // stdin: first line is space-separated list1, second line is space-separated list2
        //        empty line represents an empty list
        // stdout: space-separated merged list, or empty string for empty result
        publicTestCases: [
            { input: '1 2 4\n1 3 4', output: '1 1 2 3 4 4' },
            { input: '\n', output: '' },
        ],
        privateTestCases: [
            { input: '\n0', output: '0' },
            { input: '1\n2', output: '1 2' },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'task_template_longest_prefix_001',
        title: 'Longest Common Prefix',
        description: [
            paragraph('lcp_p1', [
                'Write a function to find the longest common prefix string amongst an array of strings.',
            ]),
            paragraph('lcp_p2', ['If there is no common prefix, return an empty string "".']),
            heading('lcp_h1', 2, [{ text: 'Example 1', bold: true }]),
            paragraph('lcp_ex1_input', [
                'Input: ',
                { text: 'strs = ["flower","flow","flight"]', code: true },
            ]),
            paragraph('lcp_ex1_output', ['Output: ', { text: '"fl"', code: true }]),
            heading('lcp_h2', 2, [{ text: 'Example 2', bold: true }]),
            paragraph('lcp_ex2_input', [
                'Input: ',
                { text: 'strs = ["dog","racecar","car"]', code: true },
            ]),
            paragraph('lcp_ex2_output', ['Output: ', { text: '""', code: true }]),
            paragraph('lcp_ex2_exp', [
                'Explanation: There is no common prefix among the input strings.',
            ]),
            heading('lcp_h3', 2, [{ text: 'Constraints', bold: true }]),
            paragraph('lcp_c1', ['- 1 <= strs.length <= 200']),
            paragraph('lcp_c2', ['- 0 <= strs[i].length <= 200']),
            paragraph('lcp_c3', ['- strs[i] consists of only lowercase English letters.']),
        ],
        // stdin: space-separated strings
        // stdout: the longest common prefix, or empty string
        publicTestCases: [
            { input: 'flower flow flight', output: 'fl' },
            { input: 'dog racecar car', output: '' },
        ],
        privateTestCases: [
            { input: 'a', output: 'a' },
            { input: 'ab a', output: 'a' },
        ],
        orgId: 'org_nextlab_001',
        taskType: 'Single Function',
        authorId: 'user_prof_fontenot_001',
    },
];
