import { type Candidate } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import {
    type CreateCandidateDTO,
    createCandidateSchema,
} from '../schemas/candidate.schema';
import { InvalidInputError } from '../schemas/errors';
import z from 'zod';

export class CandidateController {
    async create(candidate: CreateCandidateDTO): Promise<Candidate> {
        try {
            const validatedCandidate = createCandidateSchema.parse(candidate);
            return await prisma.candidate.create({
                data: validatedCandidate,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new InvalidInputError();
            }
            throw error;
        }
    }
}
