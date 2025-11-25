import { type Candidate } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { type CreateCandidateDTO, type UpdateCandidateDTO } from '@/lib/schemas/candidate.schema';
import { ConflictException, NotFoundException } from '@/lib/utils/errors.utils';

async function createCandidate(
    candidate: CreateCandidateDTO,
    organizationId: string
): Promise<Candidate> {
    const existingCandidate = await prisma.candidate.findFirst({
        where: {
            email: candidate.email,
            orgId: organizationId,
        },
    });

    if (existingCandidate) {
        throw new ConflictException('Candidate', 'with that email and organization');
    }

    const createdCandidate = await prisma.candidate.create({
        data: {
            ...candidate,
            orgId: organizationId,
        },
    });
    return createdCandidate;
}

/**
 * PUT /api/candidates/[id]
 *
 */
async function updateCandidate(
    candidateId: string,
    updates: UpdateCandidateDTO
): Promise<Candidate> {
    const existingCandidate = await prisma.candidate.findUnique({
        where: { id: candidateId },
    });

    if (!existingCandidate) {
        throw new NotFoundException('Candidate', candidateId);
    }

    // If email is being updated, check for conflicts
    if (updates.email && updates.email !== existingCandidate.email) {
        const emailConflict = await prisma.candidate.findFirst({
            where: {
                email: updates.email,
                orgId: existingCandidate.orgId,
                id: { not: candidateId },
            },
        });

        if (emailConflict) {
            throw new ConflictException('Candidate', 'with that email in this organization');
        }
    }

    const updatedCandidate = await prisma.candidate.update({
        where: { id: candidateId },
        data: updates,
    });

    return updatedCandidate;
}

const CandidateService = {
    createCandidate,
    updateCandidate,
};

export default CandidateService;
