import fs from "node:fs";
import path from "node:path";
export function analyzeDependencies(dependencies, devDependencies) {
    const projectPath = process.cwd();
    // --------------------------------
    // Get project files
    // --------------------------------
    const files = getProjectFiles(projectPath);
    // --------------------------------
    // Read source files
    // --------------------------------
    let sourceCode = "";
    for (const file of files) {
        try {
            sourceCode +=
                fs.readFileSync(file, "utf-8") + "\n";
        }
        catch {
            // Ignore unreadable files
        }
    }
    // --------------------------------
    // Read package.json
    // --------------------------------
    const packageJson = readPackageJson(projectPath);
    // --------------------------------
    // Get scripts
    // --------------------------------
    const scripts = Object.values(packageJson?.scripts ?? {}).join("\n");
    // --------------------------------
    // Get configuration files
    // --------------------------------
    const configCode = readConfigFiles(projectPath);
    const searchableContent = [
        sourceCode,
        scripts,
        configCode,
    ].join("\n");
    // --------------------------------
    // Analyze production dependencies
    // --------------------------------
    const unusedDependencies = [];
    for (const dependency of Object.keys(dependencies)) {
        if (!isDependencyUsed(dependency, searchableContent)) {
            unusedDependencies.push(dependency);
        }
    }
    // --------------------------------
    // Analyze dev dependencies
    // --------------------------------
    const unusedDevDependencies = [];
    for (const dependency of Object.keys(devDependencies)) {
        if (!isDependencyUsed(dependency, searchableContent)) {
            unusedDevDependencies.push(dependency);
        }
    }
    // --------------------------------
    // Analyze missing dependencies
    // --------------------------------
    const installedDependencies = new Set([
        ...Object.keys(dependencies),
        ...Object.keys(devDependencies),
    ]);
    const importedPackages = extractImportedPackages(sourceCode);
    const missingDependencies = [];
    for (const packageName of importedPackages) {
        if (!installedDependencies.has(packageName)) {
            missingDependencies.push(packageName);
        }
    }
    return {
        unusedDependencies,
        unusedDevDependencies,
        missingDependencies,
    };
}
// --------------------------------
// Check if dependency is used
// --------------------------------
function isDependencyUsed(dependency, content) {
    const escapedDependency = escapeRegExp(dependency);
    // --------------------------------
    // Import
    // --------------------------------
    const importPattern = new RegExp(`(?:from\\s+|import\\s*\\(?\\s*|require\\(\\s*)["']${escapedDependency}(?:/[^"']*)?["']`);
    if (importPattern.test(content)) {
        return true;
    }
    // --------------------------------
    // Package name inside commands/config
    // --------------------------------
    const packagePattern = new RegExp(`(^|[^a-zA-Z0-9_-])${escapedDependency}([^a-zA-Z0-9_-]|$)`);
    return packagePattern.test(content);
}
// --------------------------------
// Extract imported packages
// --------------------------------
function extractImportedPackages(sourceCode) {
    const packages = new Set();
    const importPattern = /(?:import\s+(?:[\s\S]*?\s+from\s+)?|require\s*\(\s*|import\s*\(\s*)["']([^"']+)["']/g;
    let match;
    while ((match = importPattern.exec(sourceCode)) !== null) {
        const imported = match[1];
        // Ignore relative imports
        if (imported.startsWith(".") ||
            imported.startsWith("/")) {
            continue;
        }
        // Ignore Node.js built-in modules
        if (imported.startsWith("node:")) {
            continue;
        }
        // Get package root
        const packageName = imported.startsWith("@")
            ? imported.split("/").slice(0, 2).join("/")
            : imported.split("/")[0];
        packages.add(packageName);
    }
    return [...packages];
}
// --------------------------------
// Read package.json
// --------------------------------
function readPackageJson(projectPath) {
    const packagePath = path.join(projectPath, "package.json");
    if (!fs.existsSync(packagePath)) {
        return null;
    }
    try {
        const content = fs.readFileSync(packagePath, "utf-8");
        return JSON.parse(content);
    }
    catch {
        return null;
    }
}
// --------------------------------
// Read configuration files
// --------------------------------
function readConfigFiles(projectPath) {
    const configFiles = [
        "tsconfig.json",
        "eslint.config.js",
        "eslint.config.mjs",
        "eslint.config.cjs",
        ".eslintrc",
        ".eslintrc.json",
        ".eslintrc.js",
        ".prettierrc",
        "prettier.config.js",
        "prettier.config.mjs",
        "vite.config.ts",
        "vite.config.js",
        "next.config.js",
        "next.config.mjs",
        "next.config.ts",
        "jest.config.js",
        "jest.config.ts",
        "vitest.config.ts",
        "vitest.config.js",
    ];
    let content = "";
    for (const file of configFiles) {
        const filePath = path.join(projectPath, file);
        if (!fs.existsSync(filePath)) {
            continue;
        }
        try {
            content +=
                fs.readFileSync(filePath, "utf-8") + "\n";
        }
        catch {
            // Ignore unreadable config files
        }
    }
    return content;
}
// --------------------------------
// Find source files
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
    const supportedExtensions = new Set([
        ".ts",
        ".tsx",
        ".js",
        ".jsx",
        ".mjs",
        ".cjs",
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
            if (supportedExtensions.has(path.extname(entry.name))) {
                files.push(fullPath);
            }
        }
    }
    walk(directory);
    return files;
}
// --------------------------------
// Escape regular expression
// --------------------------------
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
