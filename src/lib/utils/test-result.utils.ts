import type {
    CandidateTestResult,
    TestCaseResult,
    TestCaseResultStatus,
} from '@/lib/types/candidate-assessment.types';

// Maps a Judge0 status id onto the status shown on a test case card
export function resolveStatusId(statusId: number): TestCaseResultStatus {
    switch (statusId) {
        case 3:
            return 'passed';
        case 5:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
            return 'runtime_error';
        default:
            return 'failed';
    }
}

export function toTestCaseResult(output: CandidateTestResult | undefined): TestCaseResult {
    return {
        status: resolveStatusId(output?.statusId ?? 0),
        actualOutput: output?.stdout ?? output?.stderr ?? '',
    };
}
