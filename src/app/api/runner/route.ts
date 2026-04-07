import { handleError } from '@/lib/utils/errors.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import { type NextRequest } from 'next/server';
import judge0Connector, {
    formatJudgeResult,
    type JudgeSubmissionRequestBody,
} from '@/lib/connectors/judge0.connector';
import { TestSubmissionSchema } from '@/lib/schemas/submission.schema';
import { mapLanguageToJudge } from '@/lib/utils/language.utils';

export async function POST(request: NextRequest) {
    try {
        await assertRecruiterOrAbove(request.headers);
        const body = await request.json();
        const parsed = TestSubmissionSchema.parse(body);
        const languageId = mapLanguageToJudge(parsed.language);
        const formatted: JudgeSubmissionRequestBody[] = parsed.tests.map((test) => ({
            source_code: parsed.code,
            language_id: languageId,
            stdin: test.input,
            expected_output: test.output,
        }));

        const result = await judge0Connector.executeSubmissions(formatted);
        const formattedResults = result.map(formatJudgeResult);

        return Response.json({
            data: formattedResults,
            status: 201,
        });
    } catch (err) {
        return handleError(err);
    }
}
