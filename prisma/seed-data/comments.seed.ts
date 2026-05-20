export const commentsData = [
    // ---- Two Sum (Laith's review) ----
    {
        id: 'comment_laith_two_sum_001',
        reviewId: 'review_laith_carter_two_sum_001',
        line: 2,
        content: 'Good call reaching for a hash map up front. Gets us O(n) instead of O(n^2).',
        reviewedAt: new Date('2026-04-13T15:08:00Z'),
    },
    {
        id: 'comment_laith_two_sum_002',
        reviewId: 'review_laith_carter_two_sum_001',
        line: 6,
        content: 'Returning indices in insertion order is clean. Nice.',
        reviewedAt: new Date('2026-04-13T15:12:00Z'),
    },
    {
        id: 'comment_laith_two_sum_003',
        reviewId: 'review_laith_carter_two_sum_001',
        line: 8,
        content:
            'Trailing `return []` is defensive but unreachable given the prompt guarantees a solution. Minor nit.',
        reviewedAt: new Date('2026-04-13T15:18:00Z'),
    },

    // ---- Two Sum (Brad's review) ----
    {
        id: 'comment_brad_two_sum_001',
        reviewId: 'review_brad_carter_two_sum_001',
        line: 3,
        content: '`enumerate` over the loop is the right move.',
        reviewedAt: new Date('2026-04-13T16:32:00Z'),
    },
    {
        id: 'comment_brad_two_sum_002',
        reviewId: 'review_brad_carter_two_sum_001',
        line: 7,
        content:
            'Storing the index after the check avoids using the same element twice. Nicely handled.',
        reviewedAt: new Date('2026-04-13T16:35:00Z'),
    },

    // ---- Reverse String (Laith's review) ----
    {
        id: 'comment_laith_reverse_001',
        reviewId: 'review_laith_carter_reverse_string_001',
        line: 2,
        content:
            '`s.reverse()` mutates in place — correct, but then returning `s` is a bit redundant.',
        reviewedAt: new Date('2026-04-13T15:27:00Z'),
    },
    {
        id: 'comment_laith_reverse_002',
        reviewId: 'review_laith_carter_reverse_string_001',
        line: 10,
        content:
            'Since reverse_string mutates s in place, the return value is unused here. Worth pointing out in interview.',
        reviewedAt: new Date('2026-04-13T15:30:00Z'),
    },

    // ---- Reverse String (Brad's review) ----
    {
        id: 'comment_brad_reverse_001',
        reviewId: 'review_brad_carter_reverse_string_001',
        line: 2,
        content: 'In-place reverse satisfies the O(1) memory constraint. Good.',
        reviewedAt: new Date('2026-04-13T16:41:00Z'),
    },

    // ---- Valid Palindrome (Laith's review) ----
    {
        id: 'comment_laith_palindrome_001',
        reviewId: 'review_laith_carter_palindrome_001',
        line: 5,
        content:
            'String concatenation in a loop is O(n^2) in Python. A list + join would be cleaner.',
        reviewedAt: new Date('2026-04-13T15:53:00Z'),
    },
    {
        id: 'comment_laith_palindrome_002',
        reviewId: 'review_laith_carter_palindrome_001',
        line: 8,
        content:
            'Bug: an empty string after stripping non-alphanumerics IS a palindrome per the prompt. Returning False here fails the " " test case.',
        reviewedAt: new Date('2026-04-13T15:57:00Z'),
    },
    {
        id: 'comment_laith_palindrome_003',
        reviewId: 'review_laith_carter_palindrome_001',
        line: 9,
        content:
            'Slice comparison is a clear approach. Two-pointer would avoid the extra allocation but is not required.',
        reviewedAt: new Date('2026-04-13T16:02:00Z'),
    },

    // ---- Valid Palindrome (Brad's review) ----
    {
        id: 'comment_brad_palindrome_001',
        reviewId: 'review_brad_carter_palindrome_001',
        line: 7,
        content:
            'The empty-string guard inverts the expected behavior — see the failing test case.',
        reviewedAt: new Date('2026-04-13T16:52:00Z'),
    },
    {
        id: 'comment_brad_palindrome_002',
        reviewId: 'review_brad_carter_palindrome_001',
        line: 15,
        content:
            '`readline` vs `read` should not matter for single-line input, but worth confirming with the candidate.',
        reviewedAt: new Date('2026-04-13T16:55:00Z'),
    },
];
