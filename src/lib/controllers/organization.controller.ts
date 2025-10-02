import { type Organization } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@/generated/prisma';
import {
    type CreateOrganizationDTO,
    type UpdateOrganizationDTO,
    createOrganizationSchema,
    updateOrganizationSchema,
    OrganizationNotFoundError,
} from '../schemas/organization.schema';
import z from 'zod';
import { InvalidInputError } from '../schemas/errors';

export class OrganizationController {
    async create(organization: CreateOrganizationDTO): Promise<Organization> {
        try {
            const { name, createdById } = createOrganizationSchema.parse(organization);

            const user = await prisma.user.findUnique({
                where: { id: createdById },
            });
            if (!user) {
                throw new InvalidInputError();
            }

            const orgWithSameName = await prisma.organization.findFirst({
                where: {
                    name,
                },
            });

            if (orgWithSameName) {
                throw new InvalidInputError();
            }

            return await prisma.organization.create({
                data: {
                    name,
                    createdById,
                },
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new InvalidInputError();
            }

            throw error;
        }
    }

    async update(id: string, organization: UpdateOrganizationDTO): Promise<Organization> {
        try {
            const { name } = updateOrganizationSchema.parse(organization);

            const orgWithSameName = await prisma.organization.findFirst({
                where: {
                    name,
                },
            });

            if (orgWithSameName) {
                throw new InvalidInputError();
            }

            const updatedOrg = await prisma.organization.update({
                where: {
                    id,
                },
                data: {
                    name,
                },
            });

            return updatedOrg;
        } catch (error) {
            if (error instanceof z.ZodError) {
                throw new InvalidInputError();
            }

            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new OrganizationNotFoundError();
            }

            throw error;
        }
    }
}
