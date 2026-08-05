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
    // --------------------------------
    // If package.json doesn't exist,
    // skip package-dependent checks
    // --------------------------------
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
    // TypeScript
    // --------------------------------
    const tsconfigPath = path.join(projectPath, "tsconfig.json");
    const hasTypeScriptConfig = fs.existsSync(tsconfigPath);
    checks.push({
        name: "typescript",
        passed: hasTypeScriptConfig,
        message: hasTypeScriptConfig
            ? "TypeScript configuration found"
            : "TypeScript configuration not found",
    });
    // --------------------------------
    // Environment file safety
    // --------------------------------
    const envPath = path.join(projectPath, ".env");
    const hasEnvFile = fs.existsSync(envPath);
    let envIgnored = false;
    if (hasEnvFile && hasGitignore) {
        try {
            const gitignoreContent = fs.readFileSync(gitignorePath, "utf-8");
            const lines = gitignoreContent
                .split(/\r?\n/)
                .map((line) => line.trim());
            envIgnored =
                lines.includes(".env") ||
                    lines.includes(".env*");
        }
        catch {
            envIgnored = false;
        }
    }
    if (hasEnvFile) {
        checks.push({
            name: "env-safety",
            passed: envIgnored,
            message: envIgnored
                ? ".env exists and is ignored by Git"
                : ".env exists but may not be ignored by Git",
        });
    }
    return checks;
}
