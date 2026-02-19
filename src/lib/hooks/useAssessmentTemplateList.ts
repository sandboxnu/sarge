import { useState, useEffect } from 'react';
import { getAssessmentTemplateList } from '@/lib/api/assessment-templates';
import { type AssessmentTemplateListItemDTO } from '@/lib/schemas/assessment-template.schema';

export function useAssessmentTemplateList() {
    const [assessmentTemplates, setAssessmentTemplates] = useState<AssessmentTemplateListItemDTO[]>(
        []
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchAssessmentList() {
            try {
                setError(null);
                const response = await getAssessmentTemplateList(page, limit);

                updateAssessmentTemplatesForPage(page, limit, response.data);
                setTotal(response.total);
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchAssessmentList();
    }, [limit, page]);

    const assessmentTemplateList = assessmentTemplates.slice(page * limit, (page + 1) * limit);

    const updateAssessmentTemplatesForPage = (
        pageNum: number,
        limit: number,
        newData: AssessmentTemplateListItemDTO[]
    ) => {
        setAssessmentTemplates((prev) => {
            const startIdx = pageNum * limit;
            const updated = [...prev];
            updated.splice(startIdx, limit, ...newData);
            return updated;
        });
    };

    const handleSelectTemplate = (id: string) => {
        setSelectedId(id);
    };

    return {
        assessmentTemplateList,
        isLoading,
        error,
        page,
        limit,
        total,
        setPage,
        setLimit,
        selectedId,
        handleSelectTemplate,
    };
}
