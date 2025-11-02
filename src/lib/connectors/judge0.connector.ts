import { type Result, success } from '@/lib/responses';

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

export async function createBatchSubmission(
    body: JudgeSubmissionRequestBody[]
): Promise<Result<string[]>> {
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

    if (!response.ok) {
        throw new Error(await response.json());
    }

    const result = await response.json();
    const tokens = result.map((submission: { token: string }) => submission.token);
    return success(tokens);
}

export async function getBatchSubmission(
    tokens: string[]
): Promise<Result<JudgeResultRequestBody[]>> {
    const url = `${process.env.JUDGE_URL}/submissions/batch?tokens=${tokens.join(',')}&fields=${fields.join(',')}`;
    const response = await fetch(url, {
        headers: {
            ...headers,
        },
    });

    if (!response.ok) {
        throw new Error(await response.json());
    }

    const result = await response.json();

    return success(result);
}
