import fs from "node:fs";
import path from "node:path";
export function runProjectChecks() {
    const projectPath = process.cwd();
    const checks = [];
    // --------------------------------
    // package.json
    // --------------------------------
    const packageJsonPath = path.join(projectPath, "package.json");
    const hasPackageJson = fs.existsSync(packageJsonPath);
    checks.push({
        name: "package.json",
        passed: hasPackageJson,
        message: hasPackageJson
            ? "package.json found"
            : "package.json is missing",
    });
    let packageJson = null;
    if (hasPackageJson) {
        try {
            const packageFile = fs.readFileSync(packageJsonPath, "utf-8");
            packageJson = JSON.parse(packageFile);
        }
        catch {
            checks.push({
                name: "package-json-valid",
                passed: false,
                message: "package.json could not be parsed",
            });
        }
    }
    // --------------------------------
    // README
    // --------------------------------
    const readmePath = path.join(projectPath, "README.md");
    const hasReadme = fs.existsSync(readmePath);
    checks.push({
        name: "README",
        passed: hasReadme,
        message: hasReadme
            ? "README.md found"
            : "README.md is missing",
    });
    // --------------------------------
    // .gitignore
    // --------------------------------
    const gitignorePath = path.join(projectPath, ".gitignore");
    const hasGitignore = fs.existsSync(gitignorePath);
    checks.push({
        name: ".gitignore",
        passed: hasGitignore,
        message: hasGitignore
            ? ".gitignore found"
            : ".gitignore is missing",
    });
    // --------------------------------
    // Git repository
    // --------------------------------
    const gitPath = path.join(projectPath, ".git");
    const hasGit = fs.existsSync(gitPath);
    checks.push({
        name: "Git",
        passed: hasGit,
        message: hasGit
            ? "Git repository detected"
            : "Git repository not detected",
    });
    // --------------------------------
    // Lockfile
    // --------------------------------
    const lockfiles = [
        "package-lock.json",
        "yarn.lock",
        "pnpm-lock.yaml",
        "bun.lock",
        "bun.lockb",
    ];
    const lockfile = lockfiles.find((file) => fs.existsSync(path.join(projectPath, file)));
    checks.push({
        name: "lockfile",
        passed: Boolean(lockfile),
        message: lockfile
            ? `${lockfile} found`
            : "No package manager lockfile found",
    });
    // --------------------------------
    // Test script
    // --------------------------------
    const hasTestScript = Boolean(packageJson?.scripts?.test);
    checks.push({
        name: "test-script",
        passed: hasTestScript,
        message: hasTestScript
            ? "Test script found"
            : "No test script found",
    });
    // --------------------------------
    // Lint script
    // --------------------------------
    const hasLintScript = Boolean(packageJson?.scripts?.lint);
    checks.push({
        name: "lint-script",
        passed: hasLintScript,
        message: hasLintScript
            ? "Lint script found"
            : "No lint script found",
    });
    // --------------------------------
    // Detect TypeScript project
    // --------------------------------
    const hasTsConfig = fs.existsSync(path.join(projectPath, "tsconfig.json"));
    const hasTypeScriptDependency = Boolean(packageJson?.dependencies?.typescript ||
        packageJson?.devDependencies?.typescript);
    const isTypeScriptProject = hasTsConfig || hasTypeScriptDependency;
    // Only check TypeScript configuration
    // when the project actually uses TypeScript.
    if (isTypeScriptProject) {
        checks.push({
            name: "typescript",
            passed: hasTsConfig,
            message: hasTsConfig
                ? "TypeScript configuration found"
                : "TypeScript project detected but tsconfig.json is missing",
        });
    }
    // --------------------------------
    // Environment file safety
    // --------------------------------
    const envFiles = [
        ".env",
        ".env.local",
        ".env.development",
        ".env.production",
        ".env.test",
    ];
    const existingEnvFiles = envFiles.filter((file) => fs.existsSync(path.join(projectPath, file)));
    if (existingEnvFiles.length > 0) {
        let envIgnored = false;
        if (hasGitignore) {
            try {
                const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
                const lines = gitignoreContent
                    .split(/\r?\n/)
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0 &&
                    !line.startsWith("#"));
                envIgnored = existingEnvFiles.every((envFile) => isIgnoredByGitignore(envFile, lines));
            }
            catch {
                envIgnored = false;
            }
        }
        checks.push({
            name: "env-safety",
            passed: envIgnored,
            message: envIgnored
                ? ".env files exist and are ignored by Git"
                : ".env files exist but may not be ignored by Git",
        });
    }
    return checks;
}
// --------------------------------
// Check .gitignore patterns
// --------------------------------
function isIgnoredByGitignore(fileName, patterns) {
    for (const pattern of patterns) {
        const normalizedPattern = pattern
            .replace(/^\/+/, "")
            .replace(/\/+$/, "");
        // Exact match
        if (normalizedPattern === fileName) {
            return true;
        }
        // .env*
        if (normalizedPattern === ".env*" &&
            fileName.startsWith(".env")) {
            return true;
        }
        // *.env
        if (normalizedPattern === "*.env" &&
            fileName.endsWith(".env")) {
            return true;
        }
        // Generic wildcard support
        if (normalizedPattern.includes("*")) {
            const regex = new RegExp("^" +
                normalizedPattern
                    .split("*")
                    .map(escapeRegExp)
                    .join(".*") +
                "$");
            if (regex.test(fileName)) {
                return true;
            }
        }
    }
    return false;
}
// --------------------------------
// Escape RegExp
// --------------------------------
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
