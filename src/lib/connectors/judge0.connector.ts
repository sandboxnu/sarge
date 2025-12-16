import { BadRequestException, InternalServerException } from '@/lib/utils/errors.utils';

// TODO: move inside the class
const headers: HeadersInit = {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    'x-rapidapi-key': process.env.JUDGE_API_KEY!,
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
};

const fields = ['stdout', 'status', 'language_id', 'stderr', 'token', 'expected_output'];

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
    constructor() {}

    async createBatchSubmission(body: JudgeSubmissionRequestBody[]): Promise<string[]> {
        if (!body || body.length === 0) {
            throw new BadRequestException('At least one submission is required');
        }

        const url = `${process.env.JUDGE_URL}/submissions/batch?fields=${fields.join(',')}`;
        const requestBody = { submissions: [...body] };
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                ...headers,
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

        const url = `${process.env.JUDGE_URL}/submissions/batch?tokens=${tokens.join(',')}&fields=${fields.join(',')}`;
        const response = await fetch(url, {
            headers: {
                ...headers,
            },
        });
        const jsonResponse = await response.json();
        if (!response.ok) {
            throw new InternalServerException(`Judge0 API error: ${jsonResponse.error}`);
        }

        return jsonResponse;
    }
}

const judge0Connector = new Judge0Connector();
export default judge0Connector;
