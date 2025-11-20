import { type Organization } from '@/generated/prisma';
import { type Organization as AuthOrganization } from 'better-auth/plugins';
import { prisma } from '@/lib/prisma';
import {
    type CreateOrganizationDTO,
    type UpdateOrganizationDTO,
} from '@/lib/schemas/organization.schema';
import {
    ConflictException,
    NotFoundException,
    InternalServerException,
} from '@/lib/utils/errors.utils';
import { auth } from '@/lib/auth/auth';
import { generateSlugFromName } from '@/lib/utils/auth.utils';

async function createOrganization(
    createOrgRequest: CreateOrganizationDTO,
    userId: string,
    headers: Headers
): Promise<AuthOrganization> {
    const orgWithSameName = await prisma.organization.findFirst({
        where: {
            name: createOrgRequest.name,
        },
    });

    if (orgWithSameName) {
        throw new ConflictException('Organization', 'with that name');
    }

    const organization = await auth.api.createOrganization({
        body: {
            name: createOrgRequest.name,
            slug: generateSlugFromName(createOrgRequest.name),
            userId,
            keepCurrentActiveOrganization: false,
        },
        headers,
    });

    if (!organization) {
        throw new InternalServerException('Failed to create organization');
    }

    return organization;
}

async function getOrganization(id: string): Promise<Organization> {
    const org = await prisma.organization.findUnique({
        where: {
            id,
        },
        select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
            slug: true,
            logo: true,
            positions: true,
            candidates: true,
        },
    });

    if (!org) {
        throw new NotFoundException('Organization', id);
    }

    return org;
}

async function updateOrganization(
    id: string,
    organization: UpdateOrganizationDTO
): Promise<Organization> {
    const { name, logo } = organization;

    const existingOrg = await prisma.organization.findUnique({
        where: { id },
    });

    if (!existingOrg) {
        throw new NotFoundException('Organization', id);
    }

    const orgWithSameName = await prisma.organization.findFirst({
        where: {
            name,
            id: { not: id },
        },
    });

    if (orgWithSameName) {
        throw new ConflictException('Organization', 'with that name');
    }

    const updated = await prisma.organization.update({
        where: {
            id,
        },
        data: {
            name,
            logo,
        },
    });
    return updated;
}

async function deleteOrganization(id: string): Promise<Organization> {
    const existingOrg = await prisma.organization.findUnique({
        where: { id },
    });

    if (!existingOrg) {
        throw new NotFoundException('Organization', id);
    }

    const deleted = await prisma.organization.delete({
        where: {
            id,
        },
    });
    return deleted;
}

const OrganizationService = {
    createOrganization,
    getOrganization,
    updateOrganization,
    deleteOrganization,
};

export default OrganizationService;
