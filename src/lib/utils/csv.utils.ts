import {
    batchAddCandidatesSchema,
    type AddCandidateWithDataDTO,
} from '@/lib/schemas/candidate-pool.schema';
import { BadRequestException } from '@/lib/utils/errors.utils';

// Normalize header by lowercasing and removing any spaces
const normalizeHeader = (h: string) => h.toLowerCase().replace(/\s+/g, '');

export function parseCandidateCsv(csv: string): AddCandidateWithDataDTO[] {
    const trimmedCsv = csv.trim();
    if (!trimmedCsv) {
        throw new BadRequestException('CSV file is empty');
    }

    const rows = trimmedCsv
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (rows.length < 2) {
        throw new BadRequestException(
            'CSV must contain a header row and at least one data row'
        );
    }

    const [headers, ...data] = rows;

    const header = headers
        .split(',')
        .map((h) => normalizeHeader(h));

    const expectedHeader = [
        'name',
        'email',
        'major',
        'graduationdate',
        'resumeurl',
        'linkedinurl',
        'githuburl',
    ];

    const headerMatches =
        header.length === expectedHeader.length &&
        expectedHeader.every((col, idx) => header[idx] === col);

    if (!headerMatches) {
        throw new BadRequestException(
            `CSV has invalid format. Expected headers: ${expectedHeader.join(', ')}`
        );
    }

    const rawCandidates = data.map((line, index) => {
        const rowNumber = index + 2;

        const cols = line.split(',').map((c) => c.trim());
        if (cols.length !== expectedHeader.length) {
            throw new BadRequestException(
                `Row ${rowNumber} has ${cols.length} columns instead of the expected ${expectedHeader.length}.`
            );
        }

        const [name, email, major, graduationDate, resumeUrl, linkedinUrl, githubUrl] = cols;

        if (!name) {
            throw new BadRequestException(`Row ${rowNumber}: name is required.`);
        }
        if (!email) {
            throw new BadRequestException(`Row ${rowNumber}: email is required.`);
        }

        return {
            name,
            email,
            major: major || null,
            graduationDate: graduationDate || null,
            resumeUrl: resumeUrl || null,
            linkedinUrl: linkedinUrl || null,
            githubUrl: githubUrl || null,
        };
    });

    // validate the parsed candidates using Zod schema
    const parsed = batchAddCandidatesSchema.parse({
        candidates: rawCandidates,
    });

    return parsed.candidates;
}