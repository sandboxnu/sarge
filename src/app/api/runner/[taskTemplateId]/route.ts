import judge0Connector, {
    type JudgeSubmissionRequestBody,
} from '@/lib/connectors/judge0.connector';
import { SubmissionSchema } from '@/lib/schemas/submission.schema';
import TaskTemplateService from '@/lib/services/task-template.service';
// import { getSession } from '@/lib/utils/auth.utils';
import { handleError } from '@/lib/utils/errors.utils';
import { mapLanguageToJudge } from '@/lib/utils/language.utils';
import { type NextRequest } from 'next/server';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ taskTemplateId: string }> }
) {
    try {
        const body = await request.json();
        const { taskTemplateId } = await params;
        const parsed = SubmissionSchema.parse(body);
        const languageId = mapLanguageToJudge(parsed.language);
        const taskTemplate = await TaskTemplateService.getTaskTemplate(
            taskTemplateId,
            'TODO: REPLACE THIS LATER LAITH WITH COOKIE'
        );
        const tests = [...taskTemplate.privateTestCases, ...taskTemplate.publicTestCases];
        const formatted: JudgeSubmissionRequestBody[] = tests.map((test) => ({
            source_code: parsed.code,
            language_id: languageId,
            stdin: test.input,
            expected_output: test.output,
        }));

        const result = await judge0Connector.executeSubmissions(formatted);
        return Response.json({
            data: result,
            status: 200,
        });
    } catch (err) {
        return handleError(err);
    }
}
