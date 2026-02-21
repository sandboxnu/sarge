'use client';

import { BlockNoteView } from '@blocknote/shadcn';
import '@blocknote/shadcn/style.css';
import '@blocknote/core/fonts/inter.css';
import {
    BasicTextStyleButton,
    BlockTypeSelect,
    ColorStyleButton,
    CreateLinkButton,
    FileCaptionButton,
    FileReplaceButton,
    FormattingToolbar,
    FormattingToolbarController,
    NestBlockButton,
    TextAlignButton,
    UnnestBlockButton,
    useCreateBlockNote,
} from '@blocknote/react';
import type { BlockNoteContent } from '@/lib/types/task-template.types';

interface CreateAssessmentModalEditorProps {
    onNotesChange: (notes: BlockNoteContent) => void;
}

export default function CreateAssessmentModalEditor({
    onNotesChange,
}: CreateAssessmentModalEditorProps) {
    const editor = useCreateBlockNote();

    const handleEditorChange = () => {
        onNotesChange(editor.document as BlockNoteContent);
    };

    return (
        <div
            className="bg-sarge-gray-50 border-sarge-gray-200 hover:border-sarge-gray-300 focus-within:border-sarge-gray-300 max-w-full min-w-0 overflow-hidden rounded-lg border transition-colors [&_.bn-editor]:max-w-full [&_.bn-editor]:overflow-hidden"
            data-blocknote-no-side-menu
            data-blocknote-editor-bg="muted"
        >
            <BlockNoteView
                editor={editor}
                editable={true}
                theme="light"
                sideMenu={false}
                onChange={handleEditorChange}
            >
                <FormattingToolbarController
                    formattingToolbar={() => (
                        <FormattingToolbar>
                            <BlockTypeSelect key={'blockTypeSelect'} />
                            <FileCaptionButton key={'fileCaptionButton'} />
                            <FileReplaceButton key={'replaceFileButton'} />
                            <BasicTextStyleButton basicTextStyle={'bold'} key={'boldStyleButton'} />
                            <BasicTextStyleButton
                                basicTextStyle={'italic'}
                                key={'italicStyleButton'}
                            />
                            <BasicTextStyleButton
                                basicTextStyle={'underline'}
                                key={'underlineStyleButton'}
                            />
                            <BasicTextStyleButton
                                basicTextStyle={'strike'}
                                key={'strikeStyleButton'}
                            />
                            <BasicTextStyleButton key={'codeStyleButton'} basicTextStyle={'code'} />
                            <TextAlignButton textAlignment={'left'} key={'textAlignLeftButton'} />
                            <TextAlignButton
                                textAlignment={'center'}
                                key={'textAlignCenterButton'}
                            />
                            <TextAlignButton textAlignment={'right'} key={'textAlignRightButton'} />
                            <ColorStyleButton key={'colorStyleButton'} />
                            <NestBlockButton key={'nestBlockButton'} />
                            <UnnestBlockButton key={'unnestBlockButton'} />
                            <CreateLinkButton key={'createLinkButton'} />
                        </FormattingToolbar>
                    )}
                />
            </BlockNoteView>
        </div>
    );
}
