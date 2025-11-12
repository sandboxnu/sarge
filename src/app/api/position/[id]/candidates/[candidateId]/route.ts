import CandidatePoolEntryService from '@/lib/services/candidate-pool-entry.service';
import { error, handleError, success } from '@/lib/responses';
import { type NextRequest } from 'next/server';

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string; candidateId: string }> }
) {
    try {
        const { id: positionId, candidateId } = await params;
        const result = await CandidatePoolEntryService.deleteCandidatePoolEntry(
            candidateId,
            positionId
        );
        if (!result.success) return Response.json(error(result.message, result.status));
        return Response.json(success(result.data, 200));
    } catch (err) {
        return handleError(err);
    }
}
