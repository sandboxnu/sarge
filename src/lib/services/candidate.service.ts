import { type Candidate } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { type CreateCandidateDTO } from '@/lib/schemas/candidate.schema';
import { success, type Result } from '@/lib/responses';

async function createCandidate(candidate: CreateCandidateDTO): Promise<Result<Candidate>> {
    const created = await prisma.candidate.create({
        data: candidate,
    });
    return success(created, 201);
}

const CandidateService = {
    createCandidate,
};

export default CandidateService;
