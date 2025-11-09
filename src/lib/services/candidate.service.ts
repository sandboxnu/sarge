import { type Candidate } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { type CreateCandidateDTO } from '@/lib/schemas/candidate.schema';
import { ConflictException } from '@/lib/utils/errors.utils';

async function createCandidate(candidate: CreateCandidateDTO): Promise<Candidate> {
    const existingCandidate = await prisma.candidate.findFirst({
        where: {
            email: candidate.email,
            orgId: candidate.orgId,
        },
    });

    if (existingCandidate) {
        throw new ConflictException('Candidate', 'with that email and organization');
    }

    const createdCandidate = await prisma.candidate.create({
        data: candidate,
    });
    return createdCandidate;
}

const CandidateService = {
    createCandidate,
};

export default CandidateService;
