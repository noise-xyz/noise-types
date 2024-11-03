// build/generateExports.ts
import { readFileSync, writeFileSync, statSync, readdirSync } from "fs";
import { join, basename } from "path";

// Directories and files that should be ignored
const IGNORED_PATTERNS = [
    // System and hidden files/directories
    /^\.git$/,
    /^\.github$/,
    /^\.vscode$/,
    /^\.idea$/,
    /^\.DS_Store$/,
    /^\.env/,

    // Build and dependency directories
    /^dist$/,
    /^node_modules$/,
    /^build$/,
    /^coverage$/,

    // Lock files and configs
    /^package-lock\.json$/,
    /^yarn\.lock$/,
    /^bun\.lockb$/,
    /^tsconfig/,
    /^\.eslintrc/,
    /^\.prettierrc/,
    /^\.babelrc/,

    // Temp and log files
    /^npm-debug\.log$/,
    /^yarn-debug\.log$/,
    /^yarn-error\.log$/,
    /^\.log$/,
    /^\.tmp$/,
    /^temp$/,

    // Documentation and misc
    /^docs$/,
    /^README\.md$/,
    /^LICENSE$/,
    /^CHANGELOG\.md$/,
];

function shouldInclude(name: string): boolean {
    return !IGNORED_PATTERNS.some((pattern) => pattern.test(name));
}

function isDirectory(path: string) {
    try {
        return statSync(path).isDirectory();
    } catch {
        return false;
    }
}

function getDirectories(srcPath: string): string[] {
    try {
        return readdirSync(srcPath)
            .filter(shouldInclude)
            .filter((file) => isDirectory(join(srcPath, file)))
            .filter((dir) => dir.charAt(0) !== "."); // Extra check for hidden directories
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

    directories.forEach((dir) => {
        // Add main directory exports
        exports[`./${dir}/*`] = {
            types: `./dist/${dir}/*.d.ts`,
            default: `./dist/${dir}/*.js`,
        };

        // Add subdirectories exports
        const subdirs = getDirectories(dir).filter(shouldInclude);

        subdirs.forEach((subdir) => {
            exports[`./${dir}/${subdir}/*`] = {
                types: `./dist/${dir}/${subdir}/*.d.ts`,
                default: `./dist/${dir}/${subdir}/*.js`,
            };
        });

        // Add typesVersions
        typesVersions["*"][`${dir}/*`] = [`./dist/${dir}/*`];
        subdirs.forEach((subdir) => {
            typesVersions["*"][`${dir}/${subdir}/*`] = [
                `./dist/${dir}/${subdir}/*`,
            ];
        });
    });

    return { exports, typesVersions };
}

// Generate index files
function generateIndexFile(directory: string) {
    const files = readdirSync(directory)
        .filter(shouldInclude)
        .filter(
            (file) =>
                file.endsWith(".ts") &&
                file !== "index.ts" &&
                !file.endsWith(".test.ts") &&
                !file.endsWith(".spec.ts"),
        );

    const indexContent = files
        .map((file) => {
            const baseName = basename(file, ".ts");
            return `export * from './${baseName}';`;
        })
        .join("\n");

    if (indexContent) {
        writeFileSync(join(directory, "index.ts"), indexContent);
    }
}

function processDirectory(directory: string) {
    if (isDirectory(directory) && shouldInclude(basename(directory))) {
        generateIndexFile(directory);

        // Process subdirectories
        readdirSync(directory)
            .map((file) => join(directory, file))
            .filter(
                (path) => isDirectory(path) && shouldInclude(basename(path)),
            )
            .forEach(processDirectory);
    }
}

// Main execution
try {
    // Generate the configurations
    const directories = getDirectories(".").filter(
        (dir) => !dir.startsWith("."),
    ); // Extra safety check for hidden directories

    const config = generateExportsConfig(directories);

    // Update package.json
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    packageJson.exports = config.exports;
    packageJson.typesVersions = config.typesVersions;

    writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

    // Process all directories
    directories.forEach(processDirectory);

    console.log("Successfully generated exports and index files");
} catch (error) {
    console.error("Error generating exports:", error);
    process.exit(1);
}
