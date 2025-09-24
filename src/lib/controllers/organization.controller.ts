import { type Organization } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { type CreateOrganizationDTO, createOrganizationSchema, ValidationError } from '../schemas/organization.schema';
import z from 'zod';

export class OrganizationController {
    async create(organization: CreateOrganizationDTO): Promise<Organization> {
        try {
            const validatedOrg = createOrganizationSchema.parse(organization);
            return await prisma.organization.create({
                data: validatedOrg,
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new ValidationError();
            }
            throw error;
        }
    }
    async getById(id: string): Promise<Organization | null> {
        try {
            return await prisma.organization.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                    users: true,
                    positions: true,
                    candidates: true,
                }
            });
        } catch (error) {
            throw error;
        }
    }
}