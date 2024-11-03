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
    packageName: string;
}

class ExportGenerator {
    private options: GeneratorOptions;

    constructor(options: Partial<GeneratorOptions> = {}) {
        this.options = {
            rootDir: process.cwd(),
            ignoreDirs: new Set([".git", "dist", "node_modules", "build"]),
            fileExtensions: new Set([".ts"]),
            excludePatterns: new Set([".d.ts", ".test.ts", ".spec.ts"]),
            packageName: "@noise-xyz/noise-types",
            ...options,
        };
    }

    private async updateTsConfig(rootDir: string): Promise<void> {
        const tsconfigPath = join(rootDir, "tsconfig.json");

        try {
            let tsconfig: any = {
                compilerOptions: {
                    target: "ES2020",
                    module: "CommonJS",
                    moduleResolution: "node",
                    baseUrl: ".",
                    paths: {
                        "@/*": ["./*"],
                    },
                    esModuleInterop: true,
                    declaration: true,
                    declarationMap: true,
                    sourceMap: true,
                    outDir: "./dist",
                    rootDir: ".",
                    strict: true,
                    skipLibCheck: true,
                    forceConsistentCasingInFileNames: true,
                },
                include: ["**/*.ts"],
                exclude: [
                    "node_modules",
                    "dist",
                    "**/*.test.ts",
                    "**/*.spec.ts",
                ],
            };

            try {
                const existingContent = await readFile(tsconfigPath, "utf-8");
                const existingConfig = JSON.parse(existingContent);
                tsconfig = {
                    ...existingConfig,
                    compilerOptions: {
                        ...existingConfig.compilerOptions,
                        ...tsconfig.compilerOptions,
                    },
                };
            } catch (error) {
                console.log("Creating new tsconfig.json...");
            }

            await writeFile(tsconfigPath, JSON.stringify(tsconfig, null, 2));

            // Create build script with fixed regex
            const buildScriptPath = join(rootDir, "build.js");
            const buildScript = `
const { execSync } = require('child_process');
const { readFileSync, writeFileSync, readdirSync, statSync } = require('fs');
const { join, relative, dirname } = require('path');

function updateImportsInFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const importRegex = /from ["']@\\/([^"']+)["']/g;
  
  const updatedContent = content.replace(
    importRegex,
    (match, path) => {
      const currentDir = dirname(filePath);
      const targetPath = join(process.cwd(), path);
      let relativePath = relative(currentDir, targetPath)
        .replace(/\\\\/g, '/');
      if (!relativePath.startsWith('.')) {
        relativePath = './' + relativePath;
      }
      return \`from '\${relativePath}'\`;
    }
  );
  writeFileSync(filePath, updatedContent);
}

function processDirectory(dir) {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory() && !['node_modules', 'dist', '.git'].includes(entry)) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.ts') && !fullPath.endsWith('.d.ts') && 
               !fullPath.endsWith('.test.ts') && !fullPath.endsWith('.spec.ts')) {
      console.log('Processing:', fullPath);
      try {
        updateImportsInFile(fullPath);
      } catch (error) {
        console.error(\`Error processing \${fullPath}:\`, error);
      }
    }
  }
}

try {
  // Update imports in TypeScript files
  console.log('Updating import paths...');
  processDirectory('.');

  // Run TypeScript compiler
  console.log('Compiling TypeScript...');
  execSync('tsc', { stdio: 'inherit' });
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
`;

            await writeFile(buildScriptPath, buildScript);

            // Update package.json scripts
            const packageJsonPath = join(rootDir, "package.json");
            const packageJson = JSON.parse(
                await readFile(packageJsonPath, "utf-8"),
            );
            packageJson.scripts = {
                ...packageJson.scripts,
                build: "node build.js",
                prepare: "npm run build",
            };
            await writeFile(
                packageJsonPath,
                JSON.stringify(packageJson, null, 2),
            );
        } catch (error) {
            console.error("Error updating tsconfig.json:", error);
            throw error;
        }
    }

    public async generate(): Promise<void> {
        try {
            console.log("Updating configuration...");
            await this.updateTsConfig(this.options.rootDir);

            console.log("Generator completed successfully!");
            console.log('Please run "npm run build" to compile the package.');
        } catch (error) {
            console.error("Error running generator:", error);
            throw error;
        }
    }
}

// Example usage
const generator = new ExportGenerator({
    rootDir: process.cwd(),
    packageName: "@noise-xyz/noise-types",
});

// Run the generator
generator.generate().catch((error) => {
    console.error("Failed to generate exports:", error);
    process.exit(1);
});
