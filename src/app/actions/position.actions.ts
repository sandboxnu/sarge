'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/utils/auth.utils';
import PositionService from '@/lib/services/position.service';
import { createPositionSchema } from '@/lib/schemas/position.schema';

export async function createPositionAction(title: string): Promise<void> {
    const session = await getSession();
    const parsed = createPositionSchema.parse({ title });

    await PositionService.createPosition(
        parsed,
        session.userId,
        session.activeOrganizationId
    );

    revalidatePath('/positions');
}

export async function getPositionPreviewAction(positionId: string) {
    await getSession();

    const position = await PositionService.getPositionPreview(positionId);

    return {
        ...position,
        createdAt: position.createdAt.toISOString(),
        candidates: position.candidates.map((c) => ({
            ...c,
            assessment: c.assessment
                ? {
                      ...c.assessment,
                      submittedAt: c.assessment.submittedAt?.toISOString() ?? null,
                  }
                : null,
        })),
    };
}
