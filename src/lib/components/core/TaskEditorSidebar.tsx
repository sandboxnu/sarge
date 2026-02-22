'use client';

import { Tabs, TabsContent, TabsList, UnderlineTabsTrigger } from '@/lib/components/ui/Tabs';
import TaskDetailsTab from '@/lib/components/core/TaskDetailsTab';
import LanguagesTab from '@/lib/components/core/LanguagesTab';
import type { BlockNoteContent } from '@/lib/types/task-template.types';
import type { TagDTO } from '@/lib/schemas/tag.schema';
import type { TaskTemplateLanguageDTO } from '@/lib/schemas/task-template-language.schema';

export interface TaskEditorSidebarProps {
    title: string;
    setTitle: (title: string) => void;
    description: BlockNoteContent;
    setDescription: (description: BlockNoteContent) => void;
    tags: TagDTO[];
    setTags: React.Dispatch<React.SetStateAction<TagDTO[]>>;
    availableTags: TagDTO[];
    setAvailableTags: React.Dispatch<React.SetStateAction<TagDTO[]>>;
    languages?: TaskTemplateLanguageDTO[];
    setLanguages: React.Dispatch<React.SetStateAction<TaskTemplateLanguageDTO[] | undefined>>;
    isSaving: boolean;
}

export default function TaskEditorSidebar({
    title,
    setTitle,
    description,
    setDescription,
    tags,
    setTags,
    availableTags,
    setAvailableTags,
    languages,
    setLanguages,
    isSaving,
}: TaskEditorSidebarProps) {
    return (
        <div className="border-r-sarge-primary-100 bg-sarge-gray-0 flex h-full min-h-0 w-full flex-col border-r-4 px-[30px] py-[10px]">
            <Tabs defaultValue="task-details" className="flex h-full flex-col gap-0">
                <TabsList className="border-sarge-gray-200 h-auto w-full justify-start gap-5 rounded-none border-b bg-transparent p-0">
                    <UnderlineTabsTrigger value="task-details">Task Details</UnderlineTabsTrigger>
                    <UnderlineTabsTrigger value="languages">Languages</UnderlineTabsTrigger>
                </TabsList>
                <TabsContent value="task-details" className="min-h-0 flex-1 overflow-y-auto pt-5">
                    <TaskDetailsTab
                        title={title}
                        setTitle={setTitle}
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
                    <LanguagesTab languages={languages} setLanguages={setLanguages} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
