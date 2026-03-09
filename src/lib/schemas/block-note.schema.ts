import { z } from 'zod';
import type { BlockNoteContent } from '@/lib/types/task-template.types';

export const blockNoteContentSchema = z.custom<BlockNoteContent>((val) => Array.isArray(val));
