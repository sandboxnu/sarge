import { BadRequestException, InternalServerException } from '@/lib/utils/errors.utils';
import { sleep } from '@/lib/utils/utils';

export interface JudgeSubmissionRequestBody {
    source_code: string;
    language_id: number;
    stdin: string;
    expected_output: string;
}

export interface JudgeResultRequestBody {
    stdout: string;
    status_id: number;
    language_id: number;
    stderr: string;
    status: object;
    token: string;
}

class Judge0Connector {
    private headers: HeadersInit;
    private fields: string[];
    private readonly POLLING_MAX_ATTEMPTS = 4;

    constructor() {
        this.headers = {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            'x-rapidapi-key': process.env.JUDGE_API_KEY!,
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        };
        this.fields = ['stdout', 'status', 'language_id', 'stderr', 'token', 'expected_output'];
    }

    async createBatchSubmission(body: JudgeSubmissionRequestBody[]): Promise<string[]> {
        if (!body || body.length === 0) {
            throw new BadRequestException('At least one submission is required');
        }

        const url = `${process.env.JUDGE_URL}/submissions/batch?fields=${this.fields.join(',')}`;
        const requestBody = { submissions: [...body] };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...this.headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });
        const jsonResponse = await response.json();
        if (!response.ok) {
            throw new InternalServerException(`Judge0 API error: ${jsonResponse.error}`);
        }

        const tokens = jsonResponse.map((submission: { token: string }) => submission.token);
        return tokens;
    }

    async getBatchSubmission(tokens: string[]): Promise<JudgeResultRequestBody[]> {
        if (!tokens || tokens.length === 0) {
            throw new BadRequestException('At least one token is required');
        }

        const url = `${process.env.JUDGE_URL}/submissions/batch?tokens=${tokens.join(',')}&fields=${this.fields.join(',')}`;
        const response = await fetch(url, {
            headers: {
                ...this.headers,
            },
        });
        const jsonResponse = await response.json();
        if (!response.ok) {
            throw new InternalServerException(`Judge0 API error: ${jsonResponse.error}`);
        }

        return jsonResponse;
    }

    // create the provided submissions w/judge0 for running test cases
    async registerSubmissions(submissions: JudgeSubmissionRequestBody[]): Promise<string[]> {
        if (!submissions || submissions.length === 0) {
            throw new Error('At least one submission is required');
        }

        const tokens = await this.createBatchSubmission(submissions);

        if (!tokens || tokens.length === 0) {
            throw new Error(
                `No tokens received from Judge0 for submissions: ${JSON.stringify(submissions, null, 2)}`
            );
        }

        return tokens;
    }

    // retrieves results from judge0 via polling
    // total timeout in milliseconds
    async waitForSubmissions(
        tokens: string[],
        totalTimeout: number
    ): Promise<{
        categorizedResults: Record<string, JudgeResultRequestBody[]>;
        allResults: JudgeResultRequestBody[];
    }> {
        let remainingTokens = [...tokens];
        let attempts = 0;
        const POLLING_DELAY_MS = totalTimeout / this.POLLING_MAX_ATTEMPTS;
        const allResults: JudgeResultRequestBody[] = [];

        // running a call to judge0 to get statuses
        while (remainingTokens.length > 0 && attempts < this.POLLING_MAX_ATTEMPTS) {
            const results = await this.getBatchSubmission(remainingTokens);
            attempts += 1;

            const pendingTokens: string[] = [];

            results.forEach((submissionResult, index) => {
                const isComplete =
                    submissionResult.status_id !== 1 && submissionResult.status_id !== 2;
                if (isComplete) {
                    allResults.push(submissionResult);
                } else {
                    pendingTokens.push(remainingTokens[index]);
                    if (attempts === this.POLLING_MAX_ATTEMPTS) {
                        allResults.push(submissionResult);
                    }
                }
            });

            remainingTokens = pendingTokens;

            if (remainingTokens.length === 0) {
                break;
            }

            if (attempts < this.POLLING_MAX_ATTEMPTS) {
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
        };

        allResults.forEach((submissionResult) => {
            switch (submissionResult.status_id) {
                case 3: // Accepted
                    categorizedResults.accepted.push(submissionResult);
                    break;
                case 4: // Wrong Answer
                    categorizedResults.wrong.push(submissionResult);
                    break;
                case 1: // In Queue
                case 2: // Processing
                case 5: // Time Limit Exceeded
                    categorizedResults.timeout.push(submissionResult);
                    break;
                case 6: // Compilation Error
                    categorizedResults.compilation_error.push(submissionResult);
                    break;
                case 7: // Runtime Error (SIGSEGV)
                case 8: // Runtime Error (SIGXFSZ)
                case 9: // Runtime Error (SIGFPE)
                case 10: // Runtime Error (SIGABRT)
                case 11: // Runtime Error (NZEC)
                case 12: // Runtime Error (Other)
                    categorizedResults.runtime_error.push(submissionResult);
                    break;
                case 13: // Internal Error
                case 14: // Exec Format Error
                    categorizedResults.system_error.push(submissionResult);
                    break;
                default:
                    break;
            }
        });

        return { categorizedResults, allResults };
    }

    // the hook will call this function
    // default timeout of 2 seconds for running all test cases
    async executeSubmissions(
        submissions: JudgeSubmissionRequestBody[],
        totalTimeout: number = 2000
    ): Promise<JudgeResultRequestBody[]> {
        const tokens = await this.registerSubmissions(submissions);
        const { allResults } = await this.waitForSubmissions(tokens, totalTimeout);
        return allResults;
    }
}

const judge0Connector = new Judge0Connector();
export default judge0Connector;
