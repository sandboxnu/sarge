import { type Position } from '@/generated/prisma';

export type PositionWithCounts = Pick<Position, 'id' | 'title'> & {
    numCandidates: number;
    numAssigned: number;
};
