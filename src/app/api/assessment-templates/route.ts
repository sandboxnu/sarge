import { CreateAssessmentTemplateSchema } from '@/lib/schemas/assessment-template.schema';
import AssessmentTemplateService from '@/lib/services/assessment-template.service';
import { getSession } from '@/lib/utils/auth.utils';
import { handleError } from '@/lib/utils/errors.utils';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // const session = await getSession(); SWITCH BACK TO THIS AFTER TESTING
        const parsed = CreateAssessmentTemplateSchema.parse({
            ...body,
        });
        const result = await AssessmentTemplateService.createAssessmentTemplate(parsed);
        return Response.json({ data: result }, { status: 201 });
    } catch (err) {
        return handleError(err);
    }
}
