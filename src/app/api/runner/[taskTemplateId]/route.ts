import { type NextRequest } from 'next/server';
import judge0Connector, {
    formatJudgeResult,
    type JudgeSubmissionRequestBody,
} from '@/lib/connectors/judge0.connector';
import { SubmissionSchema } from '@/lib/schemas/submission.schema';
import TaskTemplateService from '@/lib/services/task-template.service';
import { handleError } from '@/lib/utils/errors.utils';
import { mapLanguageToJudge } from '@/lib/utils/language.utils';

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
            'org_nextlab_001' // lmk if we want this to stay as the TODO
        );
        const tests = [...taskTemplate.publicTestCases, ...taskTemplate.privateTestCases];
        const formatted: JudgeSubmissionRequestBody[] = tests.map((test) => ({
            source_code: parsed.code,
            language_id: languageId,
            // NOTE(laith): we're replacing newline characters to actual newline characters to
            // display on the client that newline characters indicate the next parameter
            stdin: test.input.replace(/\\n/g, '\n'),
            // NOTE(laith): print() and console.log() auto append a newline character, so it would
            // double append, this removes it and the judge0Connector will normalize it for us
            expected_output: test.output.endsWith('\n') ? test.output : `${test.output}\n`,
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
