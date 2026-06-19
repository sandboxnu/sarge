import { handleError } from '@/lib/utils/errors.utils';
import { generateCodeStub } from '@/lib/utils/language.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import { type NextRequest } from 'next/server';
import { generateStubSchema } from '@/lib/schemas/task-template-language.schema';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; languageId: string }> }
) {
    try {
        await assertRecruiterOrAbove(request.headers);

        const { id, languageId } = await params;
        const body = await request.json();
        const parsed = generateStubSchema.parse(body);

        const stub = generateCodeStub(
            parsed.functionName,
            parsed.returnType,
            parsed.parameters,
            parsed.language
        );

        return Response.json(
            {
                data: {
                    taskTemplateId: id,
                    languageId: Number(languageId),
                    stub,
                },
            },
            { status: 200 }
        );
    } catch (err) {
        return handleError(err);
    }
}
