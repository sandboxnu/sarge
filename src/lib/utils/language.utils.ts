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

function toStdoutFunction(
    value: string,
    returnType: string,
    language: 'python' | 'javascript' | 'typescript' | 'c' | 'cpp' | 'ruby'
): string {
    const normalized = normalizeTypeKey(returnType);
    const isArray = normalized.endsWith('[]');

    switch (language) {
        case 'python':
            if (isArray) return `print(json.dumps(${value}, separators=(',', ':')))`;
            if (normalized === 'bool') return `print(str(${value}).lower())`;
            return `print(${value})`;
        case 'javascript':
        case 'typescript':
            if (normalized === 'string' || normalized === 'char') return `console.log(${value});`;
            return `console.log(JSON.stringify(${value}));`;
        case 'ruby':
            return `puts ${value}.inspect`;
        case 'c':
            if (isArray) return `// serialize array then fputs to stdout`;
            if (normalized === 'string') return `printf("%s\\n", ${value});`;
            if (normalized === 'float') return `printf("%f\\n", ${value});`;
            if (normalized === 'bool') return `printf("%s\\n", ${value} ? "true" : "false");`;
            return `printf("%d\\n", ${value});`;
        case 'cpp':
            if (isArray)
                return `for (auto& x : ${value}) std::cout << x << ' '; std::cout << '\\n';`;
            if (normalized === 'bool') return `std::cout << std::boolalpha << ${value} << '\\n';`;
            return `std::cout << ${value} << '\\n';`;
    }
}

function pythonParseExpr(type: string, lineExpr: string): string {
    const normalized = normalizeTypeKey(type);
    if (normalized.endsWith('[]')) return `json.loads(${lineExpr})`;
    switch (normalized) {
        case 'int':
            return `int(${lineExpr})`;
        case 'float':
            return `float(${lineExpr})`;
        case 'bool':
            return `${lineExpr}.strip() == 'true'`;
        case 'string':
        case 'char':
            return lineExpr;
        default:
            return lineExpr;
    }
}

function jsParseExpr(type: string, lineExpr: string): string {
    const normalized = normalizeTypeKey(type);
    if (normalized.endsWith('[]')) return `JSON.parse(${lineExpr})`;
    switch (normalized) {
        case 'int':
        case 'float':
            return `Number(${lineExpr})`;
        case 'bool':
            return `JSON.parse(${lineExpr})`;
        case 'string':
        case 'char':
            return lineExpr;
        default:
            return lineExpr;
    }
}

function rubyParseExpr(type: string, lineExpr: string): string {
    const normalized = normalizeTypeKey(type);
    if (normalized.endsWith('[]')) return `JSON.parse(${lineExpr})`;
    switch (normalized) {
        case 'int':
            return `${lineExpr}.to_i`;
        case 'float':
            return `${lineExpr}.to_f`;
        case 'bool':
            return `${lineExpr}.strip == 'true'`;
        case 'string':
        case 'char':
            return lineExpr;
        default:
            return lineExpr;
    }
}

function cScanLines(varName: string, type: string): string[] {
    const normalized = normalizeTypeKey(type);
    if (normalized.endsWith('[]')) {
        return [
            `    ${normalizeTypeForLanguage(type, 'c')} ${varName}; /* TODO: parse array from stdin */`,
        ];
    }
    switch (normalized) {
        // NOTE(laith): both C and C++ implementations require 4 space indenting to be put inside the main function)
        case 'int':
            return [`    int ${varName}; scanf("%d", &${varName});`];
        case 'float':
            return [`    float ${varName}; scanf("%f", &${varName});`];
        case 'bool':
            return [
                `    char _s_${varName}[8]; scanf("%7s", _s_${varName});`,
                `    bool ${varName} = (strcmp(_s_${varName}, "true") == 0);`,
            ];
        case 'char':
            return [`    char ${varName}; scanf(" %c", &${varName});`];
        case 'string':
            return [
                `    char ${varName}[4096];`,
                `    if (fgets(${varName}, sizeof(${varName}), stdin)) { ${varName}[strcspn(${varName}, "\\n")] = 0; }`,
            ];
        default: {
            const cType = normalizeTypeForLanguage(type, 'c');
            return [`    ${cType} ${varName}; /* TODO: parse from stdin */`];
        }
    }
}

function cppCinLines(varName: string, type: string): string[] {
    const normalized = normalizeTypeKey(type);
    const cppType = normalizeTypeForLanguage(type, 'cpp');
    if (normalized.endsWith('[]')) {
        return [`    ${cppType} ${varName}; /* TODO: parse array from stdin */`];
    }
    switch (normalized) {
        case 'int':
        case 'float':
        case 'char':
            return [`    ${cppType} ${varName}; std::cin >> ${varName};`];
        case 'bool':
            return [
                `    ${cppType} ${varName};`,
                `    { std::string _s; std::cin >> _s; ${varName} = (_s == "true"); }`,
            ];
        case 'string':
            return [
                `    ${cppType} ${varName};`,
                `    std::getline(std::cin >> std::ws, ${varName});`,
            ];
        default:
            return [`    ${cppType} ${varName}; /* TODO: parse from stdin */`];
    }
}

function generatePythonToStdOut(
    functionName: string,
    returnType: string,
    parameters: StubParameter[]
): string {
    const hasArray =
        parameters.some((p) => normalizeTypeKey(p.type).endsWith('[]')) ||
        normalizeTypeKey(returnType).endsWith('[]');
    const imports = hasArray ? 'import json\nimport sys' : 'import sys';
    const args = parameters.map((p) => p.name).join(', ');
    const paramLines = parameters.map(
        (p, i) => `    ${p.name} = ${pythonParseExpr(p.type, `_lines[${i}]`)}`
    );
    const print = toStdoutFunction('result', returnType, 'python');
    return [
        '# Do not edit below',
        imports,
        '',
        'if __name__ == "__main__":',
        "    _lines = sys.stdin.read().split('\\n')",
        ...paramLines,
        `    result = ${functionName}(${args})`,
        `    ${print}`,
    ].join('\n');
}

function generateJavaScriptToStdOut(
    functionName: string,
    returnType: string,
    parameters: StubParameter[]
): string {
    const args = parameters.map((p) => p.name).join(', ');
    const paramLines = parameters.map(
        (p, i) => `const ${p.name} = ${jsParseExpr(p.type, `_lines[${i}]`)};`
    );
    const print = toStdoutFunction('result', returnType, 'javascript');
    return [
        '// Do not edit below',
        `const _lines = require('fs').readFileSync('/dev/stdin', 'utf8').split('\\n');`,
        ...paramLines,
        `const result = ${functionName}(${args});`,
        print,
    ].join('\n');
}

function generateTypeScriptToStdOut(
    functionName: string,
    returnType: string,
    parameters: StubParameter[]
): string {
    return generateJavaScriptToStdOut(functionName, returnType, parameters);
}

function generateRubyToStdOut(
    functionName: string,
    returnType: string,
    parameters: StubParameter[]
): string {
    const hasArray = parameters.some((p) => normalizeTypeKey(p.type).endsWith('[]'));
    const args = parameters.map((p) => p.name).join(', ');
    const paramLines = parameters.map(
        (p, i) => `${p.name} = ${rubyParseExpr(p.type, `_lines[${i}]`)}`
    );
    const print = toStdoutFunction('result', returnType, 'ruby');
    const lines = ['# Do not edit below\n'];
    if (hasArray) lines.push("require 'json'");
    lines.push('_lines = $stdin.read.split("\\n")');
    lines.push(...paramLines);
    lines.push(`result = ${functionName}(${args})`);
    lines.push(print);
    return lines.join('\n');
}

function generateCToStdOut(
    functionName: string,
    returnType: string,
    parameters: StubParameter[]
): string {
    const args = parameters.map((p) => p.name).join(', ');
    const paramLines = parameters.flatMap((p) => cScanLines(p.name, p.type));
    const print = toStdoutFunction('result', returnType, 'c');
    return [
        '// Do not edit below',
        'int main(void) {',
        ...paramLines,
        `    ${normalizeTypeForLanguage(returnType, 'c')} result = ${functionName}(${args});`,
        `    ${print}`,
        '    return 0;',
        '}',
    ].join('\n');
}

function generateCppToStdOut(
    functionName: string,
    returnType: string,
    parameters: StubParameter[]
): string {
    const args = parameters.map((p) => p.name).join(', ');
    const paramLines = parameters.flatMap((p) => cppCinLines(p.name, p.type));
    const print = toStdoutFunction('result', returnType, 'cpp');
    return [
        '// Do not edit below',
        'int main() {',
        ...paramLines,
        `    auto result = ${functionName}(${args});`,
        `    ${print}`,
        '    return 0;',
        '}',
    ].join('\n');
}

export function generateStdOutCode(
    functionName: string,
    returnType: string,
    parameters: StubParameter[],
    language: string
): string {
    switch (language) {
        case 'python':
            return generatePythonToStdOut(functionName, returnType, parameters);
        case 'javascript':
            return generateJavaScriptToStdOut(functionName, returnType, parameters);
        case 'typescript':
            return generateTypeScriptToStdOut(functionName, returnType, parameters);
        case 'ruby':
            return generateRubyToStdOut(functionName, returnType, parameters);
        case 'c':
            return generateCToStdOut(functionName, returnType, parameters);
        case 'cpp':
            return generateCppToStdOut(functionName, returnType, parameters);
        default:
            return `// stdout conversion for ${language} is not supported.`;
    }
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

    return `#include <stdio.h>\n#include <string.h>\n#include <stdbool.h>\n\n${normalizeTypeForLanguage(returnType, 'c')} ${functionName}(${cParams || 'void'}) {\n    // TODO: implement\n}`;
}

function generateCppCodeStub(
    functionName: string,
    returnType: string,
    parameters: StubParameter[]
): string {
    const cppParams = parameters
        .map((parameter) => `${normalizeTypeForLanguage(parameter.type, 'cpp')} ${parameter.name}`)
        .join(', ');

    return `#include <iostream>\n#include <string>\n#include <vector>\n\n${normalizeTypeForLanguage(returnType, 'cpp')} ${functionName}(${cppParams}) {\n    // TODO: implement\n}`;
}

export function generateCodeStub(
    functionName: string,
    returnType: string,
    parameters: StubParameter[],
    language: string
): string {
    let stub: string;
    switch (language) {
        case 'python':
            stub = generatePythonCodeStub(functionName, returnType, parameters);
            break;
        case 'javascript':
            stub = generateJavaScriptCodeStub(functionName, parameters);
            break;
        case 'ruby':
            stub = generateRubyCodeStub(functionName, parameters);
            break;
        case 'typescript':
            stub = generateTypeScriptCodeStub(functionName, returnType, parameters);
            break;
        case 'c':
            stub = generateCCodeStub(functionName, returnType, parameters);
            break;
        case 'cpp':
            stub = generateCppCodeStub(functionName, returnType, parameters);
            break;
        default:
            return `// Code stub for ${language} is not available.`;
    }

    const conversionFunction = generateStdOutCode(functionName, returnType, parameters, language);
    return `${stub}\n\n${conversionFunction}`;
}

export function mapLanguageToJudge(language: string): number {
    switch (language) {
        case 'python':
            return 100;
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
}
