import { type CandidatePoolEntry } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { type Result, notFound, success } from '@/lib/responses';

async function createCandidatePoolEntry(
    candidateId: string,
    positionId: string
): Promise<Result<CandidatePoolEntry>> {
    const created = await prisma.candidatePoolEntry.create({
        data: {
            candidateId,
            positionId,
        },
    });

    return success(created, 201);
}

async function getCandidatePoolEntries(positionId: string): Promise<Result<CandidatePoolEntry[]>> {
    const entries = await prisma.candidatePoolEntry.findMany({
        where: {
            positionId,
        },
    });

    return success(entries, 200);
}

async function deleteCandidatePoolEntry(
    candidateId: string,
    positionId: string
): Promise<Result<CandidatePoolEntry>> {
    const existingEntry = await prisma.candidatePoolEntry.findFirst({
        where: { candidateId, positionId },
    });

    if (!existingEntry) {
        return notFound(
            'CandidatePoolEntry',
            `candidateId: ${candidateId}, positionId: ${positionId}`
        );
    }

    const _deleted = await prisma.candidatePoolEntry.deleteMany({
        where: {
            candidateId,
            positionId,
        },
    });
    return success(existingEntry, 200);
}

async function deleteCandidatePoolEntries(
    positionId: string
): Promise<Result<CandidatePoolEntry[]>> {
    const entries = await prisma.candidatePoolEntry.findMany({
        where: {
            positionId,
        },
    });

    await prisma.candidatePoolEntry.deleteMany({
        where: {
            positionId,
        },
    });

    return success(entries, 200);
}

const CandidatePoolEntryService = {
    createCandidatePoolEntry,
    getCandidatePoolEntries,
    deleteCandidatePoolEntry,
    deleteCandidatePoolEntries,
};

export default CandidatePoolEntryService;
