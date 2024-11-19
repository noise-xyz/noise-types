const { execSync } = require("child_process");
const { readFileSync, writeFileSync, readdirSync, statSync } = require("fs");
const { join, relative, dirname } = require("path");

function updateImportsInFile(filePath) {
    const content = readFileSync(filePath, "utf-8");
    const importRegex = /from ["']@\/([^"']+)["']/g;

    const updatedContent = content.replace(importRegex, (match, path) => {
        const currentDir = dirname(filePath);
        const targetPath = join(process.cwd(), path);
        let relativePath = relative(currentDir, targetPath).replace(/\\/g, "/");
        if (!relativePath.startsWith(".")) {
            relativePath = "./" + relativePath;
        }
        return `from '${relativePath}'`;
    });
    writeFileSync(filePath, updatedContent);
}

function processDirectory(dir) {
    const entries = readdirSync(dir);
    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stats = statSync(fullPath);

        if (
            stats.isDirectory() &&
            !["node_modules", "dist", ".git"].includes(entry)
        ) {
            processDirectory(fullPath);
        } else if (
            fullPath.endsWith(".ts") &&
            !fullPath.endsWith(".d.ts") &&
            !fullPath.endsWith(".test.ts") &&
            !fullPath.endsWith(".spec.ts")
        ) {
            console.log("Processing:", fullPath);
            try {
                updateImportsInFile(fullPath);
            } catch (error) {
                console.error(`Error processing ${fullPath}:`, error);
            }
        }
    }
}

try {
    // Update imports in TypeScript files
    console.log("Updating import paths...");
    processDirectory(".");

    // Run TypeScript compiler
    console.log("Compiling TypeScript...");
    execSync("tsc", { stdio: "inherit" });
} catch (error) {
    console.error("Build failed:", error);
    process.exit(1);
}
