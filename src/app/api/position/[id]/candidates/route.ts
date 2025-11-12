import CandidatePoolEntryService from '@/lib/services/candidate-pool-entry.service';
import { error, handleError, success } from '@/lib/responses';
import { type NextRequest } from 'next/server';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const positionId = (await params).id;
        const body = await request.json();
        const candidateIds: string[] = body.candidateIds;
        const createdEntries = [];

        for (const candidateId of candidateIds) {
            const result = await CandidatePoolEntryService.createCandidatePoolEntry(
                candidateId,
                positionId
            );
            if (!result.success) return Response.json(error(result.message, result.status));
            createdEntries.push(result.data);
        }

        return Response.json(success(createdEntries, 201));
    } catch (err) {
        return handleError(err);
    }
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const positionId = (await params).id;
        const result = await CandidatePoolEntryService.getCandidatePoolEntries(positionId);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const positionId = (await params).id;
        const result = await CandidatePoolEntryService.deleteCandidatePoolEntries(positionId);
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}
