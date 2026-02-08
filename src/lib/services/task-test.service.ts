import judge0Connector, {
    type JudgeSubmissionRequestBody,
    type JudgeResultRequestBody,
} from '@/lib/connectors/judge0.connector';
import { sleep } from '@/lib/utils/utils';

const POLLING_MAX_ATTEMPTS = 4;

// batch create the provided submissions w/judge0
export async function createSubmissions(
    submissions: JudgeSubmissionRequestBody[]
): Promise<string[]> {
    if (!submissions || submissions.length === 0) {
        throw new Error('At least one submission is required');
    }

    const tokens = await judge0Connector.createBatchSubmission(submissions);

    if (!tokens || tokens.length === 0) {
        throw new Error(
            `No tokens received from Judge0 for submissions: ${JSON.stringify(submissions, null, 2)}`
        );
    }

    return tokens;
}

// retrieves results from judge0 via polling
// total timeout in milliseconds
export async function waitForSubmissions(
    tokens: string[],
    totalTimeout: number
): Promise<{
    categorizedResults: Record<string, JudgeResultRequestBody[]>;
    allResults: JudgeResultRequestBody[];
}> {
    let remainingTokens = [...tokens];
    let attempts = 0;
    const POLLING_DELAY_MS = totalTimeout / POLLING_MAX_ATTEMPTS;
    const allResults: JudgeResultRequestBody[] = [];

    // running a call to judge0 to get statuses
    while (remainingTokens.length > 0 && attempts < POLLING_MAX_ATTEMPTS) {
        const results = await judge0Connector.getBatchSubmission(remainingTokens);
        attempts += 1;

        const incompleteTokens: string[] = [];

        results.forEach((submissionStatus, index) => {
            const isComplete = submissionStatus.status_id !== 1 && submissionStatus.status_id !== 2;
            if (isComplete) {
                allResults.push(submissionStatus);
            } else {
                incompleteTokens.push(remainingTokens[index]);
                if (attempts === POLLING_MAX_ATTEMPTS) {
                    allResults.push(submissionStatus);
                }
            }
        });

        remainingTokens = incompleteTokens;

        if (remainingTokens.length > 0 && attempts < POLLING_MAX_ATTEMPTS) {
            await sleep(POLLING_DELAY_MS);
        }
    }

    const categorizedResults: Record<string, JudgeResultRequestBody[]> = {
        accepted: [],
        wrong: [],
        timeout: [],
        compilation_error: [],
        runtime_error: [],
        system_error: [],
        unknown: [],
    };

    allResults.forEach((submissionStatus) => {
        switch (submissionStatus.status_id) {
            case 3: // Accepted
                categorizedResults.accepted.push(submissionStatus);
                break;
            case 4: // Wrong Answer
                categorizedResults.wrong.push(submissionStatus);
                break;
            case 5: // Time Limit Exceeded
                categorizedResults.timeout.push(submissionStatus);
                break;
            case 6: // Compilation Error
                categorizedResults.compilation_error.push(submissionStatus);
                break;
            case 7: // Runtime Error (SIGSEGV)
            case 8: // Runtime Error (SIGXFSZ)
            case 9: // Runtime Error (SIGFPE)
            case 10: // Runtime Error (SIGABRT)
            case 11: // Runtime Error (NZEC)
            case 12: // Runtime Error (Other)
                categorizedResults.runtime_error.push(submissionStatus);
                break;
            case 13: // Internal Error
            case 14: // Exec Format Error
                categorizedResults.system_error.push(submissionStatus);
                break;
            case 1: // In Queue
            case 2: // Processing
            default:
                categorizedResults.unknown.push(submissionStatus);
                break;
        }
    });

    return { categorizedResults, allResults };
}

// the hook will call this function
// default timeout of 2 seconds for running all test cases
export async function executeSubmissions(
    submissions: JudgeSubmissionRequestBody[],
    totalTimeout: number = 2000
): Promise<JudgeResultRequestBody[]> {
    const tokens = await createSubmissions(submissions);
    const { allResults } = await waitForSubmissions(tokens, totalTimeout);
    return allResults;
}
