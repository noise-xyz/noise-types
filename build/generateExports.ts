import { readdir, stat, writeFile, readFile, unlink } from "fs/promises";
import { join, relative, dirname } from "path";

interface FileStructure {
    files: string[];
    directories: Map<string, FileStructure>;
}

interface GeneratorOptions {
    rootDir: string;
    ignoreDirs: Set<string>;
    fileExtensions: Set<string>;
    excludePatterns: Set<string>;
}

class ExportGenerator {
    private options: GeneratorOptions;

    constructor(options: Partial<GeneratorOptions> = {}) {
        this.options = {
            rootDir: process.cwd(),
            ignoreDirs: new Set([".git", "dist", "node_modules", "build"]),
            fileExtensions: new Set([".ts"]),
            excludePatterns: new Set([".d.ts", ".test.ts", ".spec.ts"]),
            ...options,
        };
    }

    private shouldProcessFile(filename: string): boolean {
        const ext = filename.slice(filename.lastIndexOf("."));
        if (!this.options.fileExtensions.has(ext)) return false;
        return ![...this.options.excludePatterns].some((pattern) =>
            filename.endsWith(pattern),
        );
    }

    private shouldProcessDir(dirname: string): boolean {
        return !this.options.ignoreDirs.has(dirname);
    }

    private async scanDirectory(dir: string): Promise<FileStructure> {
        const structure: FileStructure = {
            files: [],
            directories: new Map(),
        };

        try {
            const entries = await readdir(dir);

            for (const entry of entries) {
                const fullPath = join(dir, entry);
                const stats = await stat(fullPath);

                if (stats.isDirectory()) {
                    if (this.shouldProcessDir(entry)) {
                        structure.directories.set(
                            entry,
                            await this.scanDirectory(fullPath),
                        );
                    }
                } else if (stats.isFile() && this.shouldProcessFile(entry)) {
                    structure.files.push(entry);
                }
            }
        } catch (error) {
            console.error(`Error scanning directory ${dir}:`, error);
            throw error;
        }

        return structure;
    }

    private generateExportStatement(file: string): string {
        const baseName = file.slice(0, file.lastIndexOf("."));
        return `export * from './${baseName}';`;
    }

    private async clearExistingIndexFiles(dir: string): Promise<void> {
        try {
            const indexPath = join(dir, "index.ts");
            try {
                await unlink(indexPath);
            } catch (error) {
                // Ignore error if file doesn't exist
                if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
                    throw error;
                }
            }

            const entries = await readdir(dir);
            for (const entry of entries) {
                const fullPath = join(dir, entry);
                const stats = await stat(fullPath);

                if (stats.isDirectory() && this.shouldProcessDir(entry)) {
                    await this.clearExistingIndexFiles(fullPath);
                }
            }
        } catch (error) {
            console.error(`Error clearing index files in ${dir}:`, error);
            throw error;
        }
    }

    private async generateIndexContent(
        structure: FileStructure,
        currentDir: string,
    ): Promise<string> {
        const exports: string[] = [];

        // Export only local files in this directory
        for (const file of structure.files) {
            if (file !== "index.ts") {
                exports.push(this.generateExportStatement(file));
            }
        }

        // DO NOT export subdirectories to maintain directory-level import restriction
        return exports.join("\n") + "\n";
    }

    private async updatePackageJson(rootDir: string): Promise<void> {
        const packageJsonPath = join(rootDir, "package.json");
        try {
            const content = await readFile(packageJsonPath, "utf-8");
            const pkg = JSON.parse(content);

            // Reset exports field
            pkg.exports = {};

            // Add exports for each directory level independently
            const structure = await this.scanDirectory(rootDir);

            // Root level exports only include root-level files
            pkg.exports["."] = {
                types: "./dist/index.d.ts",
                import: "./dist/index.js",
                require: "./dist/index.js",
            };

            // Process directories recursively
            const addExportsForDirectory = async (
                dirStructure: FileStructure,
                currentPath: string = "",
            ) => {
                for (const [
                    dirName,
                    subStructure,
                ] of dirStructure.directories) {
                    const exportPath = currentPath
                        ? `${currentPath}/${dirName}`
                        : dirName;
                    pkg.exports[`./${exportPath}`] = {
                        types: `./dist/${exportPath}/index.d.ts`,
                        import: `./dist/${exportPath}/index.js`,
                        require: `./dist/${exportPath}/index.js`,
                    };
                    await addExportsForDirectory(subStructure, exportPath);
                }
            };

            await addExportsForDirectory(structure);

            // Add typesVersions field for better TypeScript path resolution
            pkg.typesVersions = {
                "*": {
                    "*": ["./dist/*"],
                },
            };

            await writeFile(packageJsonPath, JSON.stringify(pkg, null, 2));
        } catch (error) {
            console.error("Error updating package.json:", error);
            throw error;
        }
    }

    private async writeIndexFile(dir: string, content: string): Promise<void> {
        const indexPath = join(dir, "index.ts");
        try {
            await writeFile(indexPath, content);
        } catch (error) {
            console.error(`Error writing index file at ${indexPath}:`, error);
            throw error;
        }
    }

    public async generate(): Promise<void> {
        try {
            console.log("Clearing existing index files...");
            await this.clearExistingIndexFiles(this.options.rootDir);

            console.log("Scanning directory structure...");
            const structure = await this.scanDirectory(this.options.rootDir);

            console.log("Generating index files...");
            // Generate index.ts files for each directory level independently
            const processDirectory = async (
                dir: string,
                struct: FileStructure,
            ) => {
                // Generate index file for current directory
                const indexContent = await this.generateIndexContent(
                    struct,
                    dir,
                );
                await this.writeIndexFile(dir, indexContent);

                // Process subdirectories
                for (const [dirName, subStructure] of struct.directories) {
                    const currentDir = join(dir, dirName);
                    await processDirectory(currentDir, subStructure);
                }
            };

            await processDirectory(this.options.rootDir, structure);

            console.log("Updating package.json...");
            await this.updatePackageJson(this.options.rootDir);

            console.log("Export generation completed successfully!");
        } catch (error) {
            console.error("Error generating exports:", error);
            throw error;
        }
    }
}

// Example usage
const generator = new ExportGenerator({
    rootDir: process.cwd(),
    ignoreDirs: new Set([".git", "dist", "node_modules", "build"]),
    fileExtensions: new Set([".ts"]),
    excludePatterns: new Set([".d.ts", ".test.ts", ".spec.ts"]),
});

// Run the generator
generator.generate().catch((error) => {
    console.error("Failed to generate exports:", error);
    process.exit(1);
});
