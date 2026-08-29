import fs from "node:fs";
import path from "node:path";
const ignoredDirectories = new Set([
    "node_modules",
    ".git",
    ".next",
    "dist",
    "build",
]);
const sourceExtensions = new Set([
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
]);
function getSourceFiles(directory) {
    const files = [];
    const entries = fs.readdirSync(directory, {
        withFileTypes: true,
    });
    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            if (ignoredDirectories.has(entry.name)) {
                continue;
            }
            files.push(...getSourceFiles(fullPath));
        }
        else {
            const extension = path.extname(entry.name);
            if (sourceExtensions.has(extension)) {
                files.push(fullPath);
            }
        }
    }
    return files;
}
function getUsedPackages(files) {
    const usedPackages = new Set();
    for (const file of files) {
        const content = fs.readFileSync(file, "utf-8");
        const patterns = [
            /import\s+(?:[\s\S]*?\s+from\s+)?["']([^"']+)["']/g,
            /require\s*\(\s*["']([^"']+)["']\s*\)/g,
            /import\s*\(\s*["']([^"']+)["']\s*\)/g,
        ];
        for (const pattern of patterns) {
            const matches = content.matchAll(pattern);
            for (const match of matches) {
                const packageName = match[1];
                if (!packageName.startsWith(".")) {
                    const rootPackage = packageName.startsWith("@")
                        ? packageName.split("/").slice(0, 2).join("/")
                        : packageName.split("/")[0];
                    usedPackages.add(rootPackage);
                }
            }
        }
    }
    return usedPackages;
}
export function analyzeDependencies(dependencies, devDependencies) {
    const projectPath = process.cwd();
    const sourceFiles = getSourceFiles(projectPath);
    const usedPackages = getUsedPackages(sourceFiles);
    const unusedDependencies = Object.keys(dependencies).filter((dependency) => !usedPackages.has(dependency));
    const unusedDevDependencies = Object.keys(devDependencies).filter((dependency) => !usedPackages.has(dependency));
    return {
        sourceFiles,
        usedPackages,
        unusedDependencies,
        unusedDevDependencies,
    };
}
