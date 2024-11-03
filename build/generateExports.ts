// build/generateExports.ts
import { readFileSync, writeFileSync, statSync, readdirSync } from "fs";
import { join, basename, relative } from "path";

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

    directories.forEach((dir) => {
        const relativePath = relative(".", dir);

        // Add main directory export
        exports[`./${relativePath}`] = {
            types: `./dist/${relativePath}/index.d.ts`,
            default: `./dist/${relativePath}/index.js`,
        };

        // Add wildcard export for directory contents
        exports[`./${relativePath}/*`] = {
            types: `./dist/${relativePath}/*.d.ts`,
            default: `./dist/${relativePath}/*.js`,
        };

        // Add to typesVersions
        typesVersions["*"][relativePath] = [`./dist/${relativePath}`];
        typesVersions["*"][`${relativePath}/*`] = [`./dist/${relativePath}/*`];
    });

    return { exports, typesVersions };
}

function generateIndexFile(directory: string) {
    try {
        const entries = readdirSync(directory, { withFileTypes: true });

        // Get all .ts files (excluding special cases)
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

        // Get all directories
        const dirs = entries
            .filter((entry) => entry.isDirectory())
            .filter((entry) => shouldInclude(entry.name))
            .map((entry) => entry.name);

        // Generate exports for both files and directories
        const fileExports = files.map((file) => {
            const baseName = basename(file, ".ts");
            return `export * from './${baseName}';`;
        });

        const dirExports = dirs.map((dir) => `export * from './${dir}';`);

        const indexContent = [...fileExports, ...dirExports].join("\n");

        if (indexContent) {
            writeFileSync(join(directory, "index.ts"), indexContent);
        }
    } catch (error) {
        console.error(`Error generating index for ${directory}:`, error);
    }
}

function generateMainIndex(directories: string[]) {
    // Get only top-level directories
    const topLevelDirs = directories
        .filter((dir) => !dir.includes("/") && !dir.includes("\\"))
        .map((dir) => basename(dir));

    const indexContent = topLevelDirs
        .map((dir) => `export * from './${dir}';`)
        .join("\n");

    writeFileSync("index.ts", indexContent);
}

// Main execution
try {
    // Get all directories including subdirectories
    const allDirs = getAllDirectories(".")
        .filter((dir) => !dir.startsWith("./."))
        .map((dir) => dir.replace(/^\.\//, "")); // Remove leading ./

    // Generate exports configuration
    const config = generateExportsConfig(allDirs);

    // Update package.json
    const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
    packageJson.exports = config.exports;
    packageJson.typesVersions = config.typesVersions;
    writeFileSync("package.json", JSON.stringify(packageJson, null, 2));

    // Generate index files for all directories
    allDirs.forEach((dir) => generateIndexFile(dir));

    // Generate main index.ts
    generateMainIndex(allDirs);

    console.log("Successfully generated exports and index files");
} catch (error) {
    console.error("Error generating exports:", error);
    process.exit(1);
}
