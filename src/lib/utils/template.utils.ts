import { prisma } from '@/lib/prisma';

export const createDuplicateTitle = async (
    title: string,
    type: 'assessment-template' | 'task-template',
    orgId: string
) => {
    const trimmedTitle = title.trim();
    const titleSuffixStart = trimmedTitle.lastIndexOf(' (');
    const sourceSuffix =
        titleSuffixStart >= 0 && trimmedTitle.endsWith(')')
            ? trimmedTitle.slice(titleSuffixStart + 2, -1)
            : '';
    const parsedSuffix = Number.parseInt(sourceSuffix, 10);
    const baseTitle =
        titleSuffixStart >= 0 && Number.isInteger(parsedSuffix) && parsedSuffix > 0
            ? trimmedTitle.slice(0, titleSuffixStart).trim()
            : trimmedTitle;

    let existingTitlesInOrg;
    if (type === 'task-template') {
        existingTitlesInOrg = await prisma.taskTemplate.findMany({
            where: {
                orgId,
                OR: [{ title: baseTitle }, { title: { startsWith: `${baseTitle} (` } }],
            },
            select: { title: true },
        });
    } else {
        existingTitlesInOrg = await prisma.assessmentTemplate.findMany({
            where: {
                orgId,
                OR: [{ title: baseTitle }, { title: { startsWith: `${baseTitle} (` } }],
            },
            select: { title: true },
        });
    }

    const existingTitleSet = new Set(existingTitlesInOrg.map((item) => item.title));
    let nextIndex = 1;
    let duplicateTitle = `${baseTitle} (${nextIndex})`;

    while (existingTitleSet.has(duplicateTitle)) {
        nextIndex += 1;
        duplicateTitle = `${baseTitle} (${nextIndex})`;
    }

    return duplicateTitle;
};
