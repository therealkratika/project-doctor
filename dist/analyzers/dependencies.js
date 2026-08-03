import fs from "node:fs";
import path from "node:path";
export function analyzeDependencies(dependencies, devDependencies) {
    const projectPath = process.cwd();
    const files = getProjectFiles(projectPath);
    let sourceCode = "";
    for (const file of files) {
        try {
            sourceCode +=
                fs.readFileSync(file, "utf-8") + "\n";
        }
        catch {
            // Ignore
        }
    }
    // --------------------------------
    // Read package.json
    // --------------------------------
    let packageJsonContent = "";
    const packageJsonPath = path.join(projectPath, "package.json");
    try {
        packageJsonContent = fs.readFileSync(packageJsonPath, "utf-8");
    }
    catch {
        // Ignore
    }
    // --------------------------------
    // Find used dependencies
    // --------------------------------
    const unusedDependencies = [];
    const unusedDevDependencies = [];
    // --------------------------------
    // Production dependencies
    // --------------------------------
    for (const dependency of Object.keys(dependencies)) {
        const used = isDependencyUsed(dependency, sourceCode, packageJsonContent);
        if (!used) {
            unusedDependencies.push(dependency);
        }
    }
    // --------------------------------
    // Development dependencies
    // --------------------------------
    for (const dependency of Object.keys(devDependencies)) {
        const used = isDependencyUsed(dependency, sourceCode, packageJsonContent);
        if (!used) {
            unusedDevDependencies.push(dependency);
        }
    }
    return {
        unusedDependencies,
        unusedDevDependencies,
    };
}
// --------------------------------
// Check whether dependency is used
// --------------------------------
function isDependencyUsed(dependency, sourceCode, packageJsonContent) {
    // --------------------------------
    // Direct import
    // --------------------------------
    const importPattern = new RegExp(`(?:from\\s+|import\\s*\\(?\\s*|require\\(\\s*)["']${escapeRegExp(dependency)}(?:/[^"']*)?["']`);
    if (importPattern.test(sourceCode)) {
        return true;
    }
    // --------------------------------
    // Package mentioned in configuration
    // --------------------------------
    const packagePattern = new RegExp(`["']${escapeRegExp(dependency)}["']`);
    if (packagePattern.test(packageJsonContent)) {
        return true;
    }
    // --------------------------------
    // Special development dependencies
    // --------------------------------
    const specialDependencies = [
        "typescript",
        "tsx",
        "ts-node",
        "eslint",
        "prettier",
        "vitest",
        "jest",
        "@types/node",
    ];
    if (specialDependencies.includes(dependency)) {
        return true;
    }
    return false;
}
// --------------------------------
// Find project files
// --------------------------------
function getProjectFiles(directory) {
    const files = [];
    const ignoredDirectories = new Set([
        "node_modules",
        ".git",
        "dist",
        "build",
        ".next",
        "coverage",
    ]);
    function walk(currentDirectory) {
        let entries;
        try {
            entries = fs.readdirSync(currentDirectory, {
                withFileTypes: true,
            });
        }
        catch {
            return;
        }
        for (const entry of entries) {
            const fullPath = path.join(currentDirectory, entry.name);
            if (entry.isDirectory() &&
                !ignoredDirectories.has(entry.name)) {
                walk(fullPath);
                continue;
            }
            if (!entry.isFile()) {
                continue;
            }
            const extension = path.extname(entry.name);
            const supportedExtensions = [
                ".ts",
                ".tsx",
                ".js",
                ".jsx",
                ".mjs",
                ".cjs",
            ];
            if (supportedExtensions.includes(extension)) {
                files.push(fullPath);
            }
        }
    }
    walk(directory);
    return files;
}
// --------------------------------
// Escape regex characters
// --------------------------------
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
