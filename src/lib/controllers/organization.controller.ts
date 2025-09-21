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
}