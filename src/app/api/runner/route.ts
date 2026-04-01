import { handleError } from '@/lib/utils/errors.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import { type NextRequest } from 'next/server';
import judge0Connector, {
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

        return Response.json(
            {
                data: result,
            },
            {
                status: 200,
            }
        );
    } catch (err) {
        console.log(err);
        return handleError(err);
    }
}
