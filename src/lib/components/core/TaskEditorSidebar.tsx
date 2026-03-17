'use client';

import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import TaskDetailsTab from '@/lib/components/core/TaskDetailsTab';
import LanguagesTab from '@/lib/components/core/LanguagesTab';
import type { BlockNoteContent } from '@/lib/types/task-template.types';
import type { TagDTO } from '@/lib/schemas/tag.schema';
import type { TaskTemplateLanguageDTO } from '@/lib/schemas/task-template-language.schema';
import SettingsTab from './SettingsTab';
import type { GenerateTaskTemplateStubPayload } from '@/lib/api/task-templates';

export interface TaskEditorSidebarProps {
    description: BlockNoteContent;
    setDescription: (description: BlockNoteContent) => void;
    tags: TagDTO[];
    setTags: React.Dispatch<React.SetStateAction<TagDTO[]>>;
    availableTags: TagDTO[];
    setAvailableTags: React.Dispatch<React.SetStateAction<TagDTO[]>>;
    languages?: TaskTemplateLanguageDTO[];
    setLanguages: React.Dispatch<React.SetStateAction<TaskTemplateLanguageDTO[] | undefined>>;
    timeout: number;
    setTimeout: React.Dispatch<React.SetStateAction<number>>;
    estimatedTime: number;
    setEstimatedTime: React.Dispatch<React.SetStateAction<number>>;
    isSaving: boolean;
    removeLanguage: (lang: string) => void;
    clearAllLanguages: () => void;
    handleLanguageSelectionChange: (selected: string | string[]) => void;
    generateStubsForLanguages: (stubConfig: GenerateTaskTemplateStubPayload) => Promise<void>;
}

export default function TaskEditorSidebar({
    description,
    setDescription,
    tags,
    setTags,
    availableTags,
    setAvailableTags,
    languages,
    timeout,
    setTimeout,
    estimatedTime,
    setEstimatedTime,
    isSaving,
    removeLanguage,
    clearAllLanguages,
    handleLanguageSelectionChange,
    generateStubsForLanguages,
}: TaskEditorSidebarProps) {
    return (
        <div className="border-r-sarge-primary-100 bg-sarge-gray-0 flex h-full min-h-0 w-full flex-col border-r-4 px-[30px] py-[10px]">
            <Tabs defaultValue="task-details" className="flex h-full flex-col gap-0">
                <TabsList className="border-sarge-gray-200 h-auto w-full justify-start gap-5 rounded-none border-b bg-transparent p-0">
                    <UnderlineTabsTrigger value="task-details">Task Details</UnderlineTabsTrigger>
                    <UnderlineTabsTrigger value="languages">Languages</UnderlineTabsTrigger>
                    <UnderlineTabsTrigger value="settings">Settings</UnderlineTabsTrigger>
                </TabsList>
                <TabsContent value="task-details" className="min-h-0 flex-1 overflow-y-auto pt-5">
                    <TaskDetailsTab
                        description={description}
                        setDescription={setDescription}
                        tags={tags}
                        setTags={setTags}
                        availableTags={availableTags}
                        setAvailableTags={setAvailableTags}
                        isSaving={isSaving}
                    />
                </TabsContent>
                <TabsContent value="languages" className="min-h-0 flex-1 overflow-y-auto pt-5">
                    <LanguagesTab
                        languages={languages}
                        removeLanguage={removeLanguage}
                        clearAllLanguages={clearAllLanguages}
                        handleLanguageSelectionChange={handleLanguageSelectionChange}
                        generateStubsForLanguages={generateStubsForLanguages}
                    />
                </TabsContent>
                <TabsContent value="settings" className="min-h-0 flex-1 overflow-y-auto pt-5">
                    <SettingsTab
                        timeout={timeout}
                        setTimeout={setTimeout}
                        estimatedTime={estimatedTime}
                        setEstimatedTime={setEstimatedTime}
                        isSaving={isSaving}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
