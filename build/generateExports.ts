// build/generateExports.ts
import { readFileSync, writeFileSync, statSync, readdirSync } from "fs";
import { join, basename, dirname } from "path";

const IGNORED_PATTERNS = [
    /^\.git$/,
    /^\.github$/,
    /^\.vscode$/,
    /^\.idea$/,
    /^\.DS_Store$/,
    /^\.env/,
    /^dist$/,
    /^node_modules$/,
    /^build$/,
    /^coverage$/,
    /^package-lock\.json$/,
    /^yarn\.lock$/,
    /^bun\.lockb$/,
    /^tsconfig/,
    /^\.eslintrc/,
    /^\.prettierrc/,
    /^\.babelrc/,
    /^npm-debug\.log$/,
    /^yarn-debug\.log$/,
    /^yarn-error\.log$/,
    /^\.log$/,
    /^\.tmp$/,
    /^temp$/,
    /^docs$/,
    /^README\.md$/,
    /^LICENSE$/,
    /^CHANGELOG\.md$/,
];

type ModuleConfig = {
    requireSubmodule: boolean;
    submodules: string[];
};

type ModuleStructure = {
    [key: string]: ModuleConfig;
};

// Define the module structure
const MODULE_STRUCTURE: ModuleStructure = {
    database: {
        requireSubmodule: true,
        submodules: ["relations", "tables", "types"],
    },
    trading: {
        requireSubmodule: true,
        submodules: [],
    },
    events: {
        requireSubmodule: true,
        submodules: [],
    },
    logs: {
        requireSubmodule: true,
        submodules: [],
    },
    positions: {
        requireSubmodule: true,
        submodules: [],
    },
    conversions: {
        requireSubmodule: true,
        submodules: [],
    },
    utils: {
        requireSubmodule: true,
        submodules: [],
    },
};

function shouldInclude(name: string): boolean {
    return !IGNORED_PATTERNS.some((pattern) => pattern.test(name));
}

function getAllDirectories(srcPath: string): string[] {
    try {
        const entries = readdirSync(srcPath, { withFileTypes: true });

        const dirs = entries
            .filter((entry) => entry.isDirectory())
            .filter((entry) => shouldInclude(entry.name))
            .filter((entry) => !entry.name.startsWith("."))
            .map((entry) => join(srcPath, entry.name));

        const subdirs = dirs.flatMap((dir) => getAllDirectories(dir));

        return [...dirs, ...subdirs];
    } catch {
        return [];
    }
}

function generateExportsConfig(directories: string[]) {
    const exports: Record<string, any> = {
        ".": {
            types: "./dist/index.d.ts",
            default: "./dist/index.js",
        },
    };

    const typesVersions: Record<string, any> = {
        "*": {},
    };

    Object.entries(MODULE_STRUCTURE).forEach(([moduleName, config]) => {
        if (!config.requireSubmodule) {
            exports[`./${moduleName}`] = {
                types: `./dist/${moduleName}/index.d.ts`,
                default: `./dist/${moduleName}/index.js`,
            };
            typesVersions["*"][moduleName] = [`./dist/${moduleName}`];
        }

        exports[`./${moduleName}/*`] = {
            types: `./dist/${moduleName}/*.d.ts`,
            default: `./dist/${moduleName}/*.js`,
        };
        typesVersions["*"][`${moduleName}/*`] = [`./dist/${moduleName}/*`];

        config.submodules.forEach((submodule) => {
            exports[`./${moduleName}/${submodule}`] = {
                types: `./dist/${moduleName}/${submodule}/index.d.ts`,
                default: `./dist/${moduleName}/${submodule}/index.js`,
            };
            exports[`./${moduleName}/${submodule}/*`] = {
                types: `./dist/${moduleName}/${submodule}/*.d.ts`,
                default: `./dist/${moduleName}/${submodule}/*.js`,
            };

            typesVersions["*"][`${moduleName}/${submodule}`] = [
                `./dist/${moduleName}/${submodule}`,
            ];
            typesVersions["*"][`${moduleName}/${submodule}/*`] = [
                `./dist/${moduleName}/${submodule}/*`,
            ];
        });
    });

    return { exports, typesVersions };
}

function generateIndexFile(directory: string) {
    try {
        const dirName = basename(directory);
        const parentDir = basename(dirname(directory));
        const moduleConfig = MODULE_STRUCTURE[parentDir];

        const entries = readdirSync(directory, { withFileTypes: true });

        const files = entries
            .filter((entry) => entry.isFile())
            .filter(
                (entry) =>
                    entry.name.endsWith(".ts") &&
                    entry.name !== "index.ts" &&
                    !entry.name.endsWith(".test.ts") &&
                    !entry.name.endsWith(".spec.ts"),
            )
            .map((entry) => entry.name);

        if (
            moduleConfig?.requireSubmodule &&
            !moduleConfig.submodules.includes(dirName)
        ) {
            const content =
                `// This module requires importing from specific submodules\n` +
                `// Please import from one of: ${moduleConfig.submodules.join(
                    ", ",
                )}`;
            writeFileSync(join(directory, "index.ts"), content);
            return;
        }

        const fileExports = files.map((file) => {
            const baseName = basename(file, ".ts");
            return `export * from './${baseName}';`;
        });

        const indexContent = fileExports.join("\n");

        if (indexContent) {
            writeFileSync(join(directory, "index.ts"), indexContent);
        }
    } catch (error) {
        console.error(`Error generating index for ${directory}:`, error);
    }
}

function generateMainIndex() {
    const indexContent = Object.entries(MODULE_STRUCTURE)
        .map(([moduleName, config]) => {
            if (config.requireSubmodule) {
                return `export const ${moduleName} = {};`;
            } else {
                return `export * as ${moduleName} from './${moduleName}';`;
            }
        })
        .join("\n");

    writeFileSync("index.ts", indexContent);
}

try {
    const allDirs = getAllDirectories(".")
        .filter((dir) => !dir.startsWith("./."))
        .map((dir) => dir.replace(/^\.\//, ""));

    const config = generateExportsConfig(allDirs);

    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    packageJson.exports = config.exports;
    packageJson.typesVersions = config.typesVersions;
    writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

    allDirs.forEach((dir) => generateIndexFile(dir));

    generateMainIndex();

    console.log("Successfully generated exports and index files");
} catch (error) {
    console.error("Error generating exports:", error);
    process.exit(1);
}
