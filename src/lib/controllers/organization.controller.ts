import { type Organization } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { type CreateOrganizationDTO, createOrganizationSchema, ValidationError } from '../schemas/organization.schema';
import z from 'zod';

export class OrganizationController {
    async create(organization: CreateOrganizationDTO): Promise<Organization> {
            try {
                const validatedOrg = createOrganizationSchema.parse(organization);
                // Check if createdById is an existing User
                const user = await prisma.user.findUnique({ where: { id: validatedOrg.createdById } });
                if (!user) {
                    throw new ValidationError(); // Or a more specific error for not found
                }
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