'use client';

import { useMemo, useState } from 'react';
import { useTaskEditor } from '@/lib/hooks/useTaskEditor';
import type { TaskTemplateDetail } from '@/lib/types/task-template.types';
import type { TaskEditorSectionId } from '@/lib/constants/task-editor.constants';
import { TaskEditorShell } from '@/lib/components/core/task-editor/TaskEditorShell';
import { DetailsSection } from '@/lib/components/core/task-editor/DetailsSection';
import { LanguagesSection } from '@/lib/components/core/task-editor/LanguagesSection';
import { CodeStubSection } from '@/lib/components/core/task-editor/CodeStubSection';
import { SolutionTestsSection } from '@/lib/components/core/task-editor/SolutionTestsSection';
import { SettingsSection } from '@/lib/components/core/task-editor/SettingsSection';
import type { ReactNode } from 'react';

interface TaskEditorProps {
    initialTemplate: TaskTemplateDetail;
}

export function TaskEditor({ initialTemplate }: TaskEditorProps) {
    const [currentSection, setCurrentSection] = useState<TaskEditorSectionId>('details');

    const {
        title,
        setTitle,
        description,
        setDescription,
        tags,
        setTags,
        selectedLanguages,
        setSelectedLanguages,
        recommendedTimeMinutes,
        setRecommendedTimeMinutes,
        testCases,
        currentLanguage,
        selectedTestCaseId,
        isSaving,
        isRunning,
        testOutput,
        editorRef,
        handleAddTestCase,
        handleDeleteTestCase,
        handleUpdateTestCase,
        handleToggleTestCaseVisibility,
        handleSelectTestCase,
        handleEditorMount,
        handleLanguageChange,
        handleRunCode,
        handleSave,
    } = useTaskEditor(initialTemplate);

    const sectionComponents = useMemo<Record<TaskEditorSectionId, ReactNode>>(
        () => ({
            details: (
                <DetailsSection
                    title={title}
                    onTitleChange={setTitle}
                    description={description}
                    onDescriptionChange={setDescription}
                    tags={tags}
                    onTagsChange={setTags}
                />
            ),
            languages: (
                <LanguagesSection
                    selectedLanguages={selectedLanguages}
                    onSelectedLanguagesChange={setSelectedLanguages}
                />
            ),
            'code-stub': (
                <CodeStubSection
                    selectedLanguages={selectedLanguages}
                    currentLanguage={currentLanguage}
                    onLanguageChange={handleLanguageChange}
                    onEditorMount={handleEditorMount}
                    editorRef={editorRef}
                />
            ),
            'solution-tests': (
                <SolutionTestsSection
                    selectedLanguages={selectedLanguages}
                    currentLanguage={currentLanguage}
                    onLanguageChange={handleLanguageChange}
                    onEditorMount={handleEditorMount}
                    editorRef={editorRef}
                    testCases={testCases}
                    selectedTestCaseId={selectedTestCaseId}
                    onSelectTestCase={handleSelectTestCase}
                    onAddTestCase={handleAddTestCase}
                    onDeleteTestCase={handleDeleteTestCase}
                    onUpdateTestCase={handleUpdateTestCase}
                    onToggleTestCaseVisibility={handleToggleTestCaseVisibility}
                    onRunCode={handleRunCode}
                    isRunning={isRunning}
                    testOutput={testOutput}
                />
            ),
            settings: (
                <SettingsSection
                    recommendedTimeMinutes={recommendedTimeMinutes}
                    onRecommendedTimeChange={setRecommendedTimeMinutes}
                />
            ),
        }),
        [
            title,
            description,
            tags,
            selectedLanguages,
            currentLanguage,
            testCases,
            selectedTestCaseId,
            isRunning,
            testOutput,
            recommendedTimeMinutes,
            handleLanguageChange,
            handleEditorMount,
            handleSelectTestCase,
            handleAddTestCase,
            handleDeleteTestCase,
            handleUpdateTestCase,
            handleToggleTestCaseVisibility,
            handleRunCode,
            editorRef,
        ]
    );

    return (
        <TaskEditorShell
            taskName={title || 'Untitled'}
            currentSection={currentSection}
            onSectionChange={setCurrentSection}
            onSave={handleSave}
            isSaving={isSaving}
        >
            {sectionComponents[currentSection] ?? null}
        </TaskEditorShell>
    );
}
