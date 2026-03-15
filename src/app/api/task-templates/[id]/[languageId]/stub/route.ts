import { handleError } from '@/lib/utils/errors.utils';
import { generateCodeStub } from '@/lib/utils/language.utils';
import { assertRecruiterOrAbove } from '@/lib/utils/permissions.utils';
import { type NextRequest } from 'next/server';
import { z } from 'zod';

const generateStubSchema = z.object({
    functionName: z.string().trim().min(1),
    returnType: z.string().trim().min(1),
    parameters: z.array(
        z.object({
            name: z.string().trim().min(1),
            type: z.string().trim().min(1),
        })
    ),
    language: z.string().trim().min(1),
});

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
