import { readdir, stat, writeFile, readFile } from "fs/promises";
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
        return `export * from \"./${baseName}\";`;
    }

    private async generateIndexContent(
        structure: FileStructure,
        currentDir: string,
    ): Promise<string> {
        const exports: string[] = [];

        // Export local files
        for (const file of structure.files) {
            if (file !== "index.ts") {
                exports.push(this.generateExportStatement(file));
            }
        }

        // Export subdirectories
        for (const [dirName] of structure.directories) {
            exports.push(`export * from './${dirName}';`);
        }

        return exports.join("\n") + "\n";
    }

    private async updatePackageJson(rootDir: string): Promise<void> {
        const packageJsonPath = join(rootDir, "package.json");
        try {
            const content = await readFile(packageJsonPath, "utf-8");
            const pkg = JSON.parse(content);

            // Ensure exports field exists
            pkg.exports = {
                ".": {
                    types: "./dist/index.d.ts",
                    import: "./dist/index.js",
                    require: "./dist/index.js",
                },
            };

            // Add exports for each subdirectory
            const structure = await this.scanDirectory(rootDir);
            for (const [dirName] of structure.directories) {
                pkg.exports[`./${dirName}`] = {
                    types: `./dist/${dirName}/index.d.ts`,
                    import: `./dist/${dirName}/index.js`,
                    require: `./dist/${dirName}/index.js`,
                };
            }

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
            console.log("Scanning directory structure...");
            const structure = await this.scanDirectory(this.options.rootDir);

            console.log("Generating index files...");
            // Generate root index.ts
            const rootIndexContent = await this.generateIndexContent(
                structure,
                this.options.rootDir,
            );
            await this.writeIndexFile(this.options.rootDir, rootIndexContent);

            // Generate index.ts for each subdirectory
            const processDirectory = async (
                dir: string,
                struct: FileStructure,
            ) => {
                for (const [dirName, subStructure] of struct.directories) {
                    const currentDir = join(dir, dirName);
                    const indexContent = await this.generateIndexContent(
                        subStructure,
                        currentDir,
                    );
                    await this.writeIndexFile(currentDir, indexContent);
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
