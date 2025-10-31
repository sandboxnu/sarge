import { type Organization } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import {
    type CreateOrganizationDTO,
    type UpdateOrganizationDTO,
} from '@/lib/schemas/organization.schema';
import { type Result, notFound, conflict, success } from '@/lib/responses';

async function createOrganization(
    organization: CreateOrganizationDTO
): Promise<Result<Organization>> {
    const { name, createdById } = organization;

    const user = await prisma.user.findUnique({
        where: { id: createdById },
    });
    if (!user) {
        return notFound('User', createdById);
    }

    const orgWithSameName = await prisma.organization.findFirst({
        where: {
            name,
        },
    });

    if (orgWithSameName) {
        return conflict('Organization', 'with that name');
    }

    const created = await prisma.organization.create({
        data: {
            name,
            createdById,
        },
    });
    return success(created, 201);
}

async function getOrganization(id: string): Promise<Result<Organization>> {
    const org = await prisma.organization.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            createdById: true,
            users: true,
            positions: true,
            candidates: true,
            imageUrl: true,
        },
    });

    if (!org) {
        return notFound('Organization', id);
    }

    return success(org, 200);
}

async function updateOrganization(
    id: string,
    organization: UpdateOrganizationDTO
): Promise<Result<Organization>> {
    const { name } = organization;

    const existingOrg = await prisma.organization.findUnique({
        where: { id },
    });

    if (!existingOrg) {
        return notFound('Organization', id);
    }

    const orgWithSameName = await prisma.organization.findFirst({
        where: {
            name,
            id: { not: id },
        },
    });

    if (orgWithSameName) {
        return conflict('Organization', 'with that name');
    }

    const updated = await prisma.organization.update({
        where: {
            id,
        },
        data: {
            name,
        },
    });
    return success(updated, 200);
}

async function deleteOrganization(id: string): Promise<Result<Organization>> {
    const existingOrg = await prisma.organization.findUnique({
        where: { id },
    });

    if (!existingOrg) {
        return notFound('Organization', id);
    }

    const deleted = await prisma.organization.delete({
        where: {
            id,
        },
    });
    return success(deleted, 200);
}

const OrganizationService = {
    createOrganization,
    getOrganization,
    updateOrganization,
    deleteOrganization,
};

export default OrganizationService;
