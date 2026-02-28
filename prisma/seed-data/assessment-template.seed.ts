import { paragraph } from './blocknote-helpers';

export const assessmentTemplatesData = [
    {
        id: 'assessment_template_general_001',
        title: 'General Software Engineering Assessment',
        taskTemplates: [
            'task_template_two_sum_001',
            'task_template_reverse_string_001',
            'task_template_palindrome_001',
        ],
        authorId: 'user_prof_fontenot_001',
        notes: [
            paragraph('gen_note_1', [
                'Focus on clean code over optimization. ',
                { text: 'Two Sum is the hardest', bold: true },
                ' -- if a candidate struggles, check if they understand hash maps.',
            ]),
            paragraph('gen_note_2', [
                'Reverse String is intentionally easy to build confidence before the harder problems.',
            ]),
        ],
    },
    {
        id: 'assessment_template_algorithms_001',
        title: 'Algorithms Focus Assessment',
        taskTemplates: [
            'task_template_two_sum_001',
            'task_template_fizzbuzz_001',
            'task_template_quick_warmup_001',
        ],
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'assessment_template_swe_coop_fall_2026',
        title: 'Software Engineer Co-op Fall 2026',
        description:
            'Technical assessment for Fall 2026 software engineering co-op candidates. Covers core data structures, string manipulation, and algorithmic thinking.',
        taskTemplates: [
            'task_template_two_sum_001',
            'task_template_valid_parentheses_001',
            'task_template_binary_search_001',
        ],
        authorId: 'user_prof_fontenot_001',
        notes: [
            paragraph('coop_note_1', [
                'This assessment is calibrated for junior co-op candidates. ',
                'Binary Search should separate strong candidates from average ones.',
            ]),
        ],
    },
    {
        id: 'assessment_template_swe_intern_summer_2026',
        title: 'Software Engineer Intern Summer 2026',
        description:
            'Introductory-level assessment for summer 2026 internship applicants. Focuses on fundamentals and clean code.',
        taskTemplates: ['task_template_fizzbuzz_001', 'task_template_reverse_string_001'],
        authorId: 'user_prof_fontenot_001',
    },
    {
        id: 'assessment_template_fullstack_coop_spring_2026',
        title: 'Fullstack Developer Co-op Spring 2026',
        description:
            'Assessment for fullstack co-op candidates. Tests array manipulation, linked list operations, and prefix matching.',
        taskTemplates: [
            'task_template_max_subarray_001',
            'task_template_merge_sorted_001',
            'task_template_longest_prefix_001',
        ],
        authorId: 'user_prof_fontenot_001',
    },
];
