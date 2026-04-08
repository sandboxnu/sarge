import { ProgrammingLanguage } from '@/generated/prisma';

/**
 * Any language not listed here falls back to capitalizing the first letter.
 */
const LANGUAGE_DISPLAY_NAMES: Partial<Record<string, string>> = {
    javascript: 'JavaScript',
    c: 'C',
    typescript: 'TypeScript',
    ruby: 'Ruby',
    cpp: 'C++',
};

/**
 * Returns the display label for a ProgrammingLanguage enum value.
 * 'python' -> 'Python', 'javascript' -> 'JavaScript'
 */
export function getLanguageLabel(lang: string): string {
    return LANGUAGE_DISPLAY_NAMES[lang] ?? lang.charAt(0).toUpperCase() + lang.slice(1);
}

export function getLanguageOptions(): { value: string; label: string }[] {
    return Object.values(ProgrammingLanguage).map((lang) => ({
        value: lang,
        label: getLanguageLabel(lang),
    }));
}

type StubParameter = { name: string; type: string };

const SUPPORTED_STUB_PRIMITIVE_TYPES = ['int', 'float', 'string', 'bool', 'char', 'void'] as const;

const SIMPLE_TYPE_ALIASES = {
    python: {
        int: 'int',
        float: 'float',
        bool: 'bool',
        string: 'str',
        char: 'str',
        void: 'None',
    },
    typescript: {
        int: 'number',
        float: 'number',
        bool: 'boolean',
        string: 'string',
        char: 'string',
        void: 'void',
    },
    c: {
        int: 'int',
        float: 'float',
        bool: 'bool',
        string: 'char*',
        char: 'char',
        void: 'void',
    },
    cpp: {
        int: 'int',
        float: 'float',
        bool: 'bool',
        string: 'std::string',
        char: 'char',
        void: 'void',
    },
} as const;

function normalizeWhitespace(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
}

function normalizeTypeKey(value: string): string {
    return normalizeWhitespace(value).toLowerCase();
}

function isSupportedStubPrimitiveType(
    value: string
): value is (typeof SUPPORTED_STUB_PRIMITIVE_TYPES)[number] {
    return SUPPORTED_STUB_PRIMITIVE_TYPES.includes(
        value as (typeof SUPPORTED_STUB_PRIMITIVE_TYPES)[number]
    );
}

function normalizeTypeForLanguage(
    type: string,
    language: 'python' | 'typescript' | 'c' | 'cpp'
): string {
    const trimmedType = normalizeWhitespace(type);
    const lowerType = normalizeTypeKey(trimmedType);

    if (lowerType.endsWith('[]')) {
        const itemTypeKey = normalizeTypeKey(trimmedType.slice(0, -2));
        if (!isSupportedStubPrimitiveType(itemTypeKey) || itemTypeKey === 'void') {
            return trimmedType;
        }

        const itemType = normalizeTypeForLanguage(itemTypeKey, language);

        switch (language) {
            case 'python':
                return `list[${itemType}]`;
            case 'typescript':
                return `${itemType}[]`;
            case 'c':
                if (itemTypeKey === 'string') {
                    return 'char**';
                }
                return `${itemType}*`;
            case 'cpp':
                return `std::vector<${itemType}>`;
        }
    }

    if (!isSupportedStubPrimitiveType(lowerType)) {
        return trimmedType;
    }

    return SIMPLE_TYPE_ALIASES[language][lowerType];
}

function generatePythonCodeStub(
    functionName: string,
    returnType: string,
    parameters: StubParameter[]
): string {
    const pythonParams = parameters
        .map(
            (parameter) =>
                `${parameter.name}: ${normalizeTypeForLanguage(parameter.type, 'python')}`
        )
        .join(', ');

    return `def ${functionName}(${pythonParams}) -> ${normalizeTypeForLanguage(returnType, 'python')}:\n    pass`;
}

function generateJavaScriptCodeStub(functionName: string, parameters: StubParameter[]): string {
    const jsParams = parameters.map((parameter) => parameter.name).join(', ');
    return `function ${functionName}(${jsParams}) {\n    // TODO: implement\n}`;
}

function generateRubyCodeStub(functionName: string, parameters: StubParameter[]): string {
    const rubyParams = parameters.map((parameter) => parameter.name).join(', ');
    return `def ${functionName}(${rubyParams})\n  # TODO: implement\nend`;
}

function generateTypeScriptCodeStub(
    functionName: string,
    returnType: string,
    parameters: StubParameter[]
): string {
    const tsParams = parameters
        .map(
            (parameter) =>
                `${parameter.name}: ${normalizeTypeForLanguage(parameter.type, 'typescript')}`
        )
        .join(', ');

    return `function ${functionName}(${tsParams}): ${normalizeTypeForLanguage(returnType, 'typescript')} {\n    // TODO: implement\n}`;
}

function generateCCodeStub(
    functionName: string,
    returnType: string,
    parameters: StubParameter[]
): string {
    const cParams = parameters
        .map((parameter) => `${normalizeTypeForLanguage(parameter.type, 'c')} ${parameter.name}`)
        .join(', ');

    return `${normalizeTypeForLanguage(returnType, 'c')} ${functionName}(${cParams || 'void'}) {\n    // TODO: implement\n}`;
}

function generateCppCodeStub(
    functionName: string,
    returnType: string,
    parameters: StubParameter[]
): string {
    const cppParams = parameters
        .map((parameter) => `${normalizeTypeForLanguage(parameter.type, 'cpp')} ${parameter.name}`)
        .join(', ');

    return `${normalizeTypeForLanguage(returnType, 'cpp')} ${functionName}(${cppParams}) {\n    // TODO: implement\n}`;
}

export function generateCodeStub(
    functionName: string,
    returnType: string,
    parameters: StubParameter[],
    language: string
): string {
    switch (language) {
        case 'python':
            return generatePythonCodeStub(functionName, returnType, parameters);
        case 'javascript':
            return generateJavaScriptCodeStub(functionName, parameters);
        case 'ruby':
            return generateRubyCodeStub(functionName, parameters);
        case 'typescript':
            return generateTypeScriptCodeStub(functionName, returnType, parameters);
        case 'c':
            return generateCCodeStub(functionName, returnType, parameters);
        case 'cpp':
            return generateCppCodeStub(functionName, returnType, parameters);
        default:
            return `// Code stub for ${language} is not available.`;
    }
}

export function mapLanguageToJudge(language: string): number {
    try {
        switch (language) {
            case 'python':
                return 71;
            case 'javascript':
                return 102;
            case 'ruby':
                return 72;
            case 'typescript':
                return 101;
            case 'c':
                return 103;
            case 'cpp':
                return 105;
            default:
                return -1;
        }
    } catch {
        // figure this out later
        throw new Error('language not foudn');
    }
}
