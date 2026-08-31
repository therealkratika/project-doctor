import fs from "node:fs";
import path from "node:path";
export function runProjectChecks() {
    const projectPath = process.cwd();
    const checks = [];
    // package.json
    const packageJsonPath = path.join(projectPath, "package.json");
    checks.push({
        name: "package.json",
        passed: fs.existsSync(packageJsonPath),
        message: fs.existsSync(packageJsonPath)
            ? "package.json found"
            : "package.json is missing",
    });
    // README
    const readmePath = path.join(projectPath, "README.md");
    checks.push({
        name: "README",
        passed: fs.existsSync(readmePath),
        message: fs.existsSync(readmePath)
            ? "README.md found"
            : "README.md is missing",
    });
    // .gitignore
    const gitignorePath = path.join(projectPath, ".gitignore");
    checks.push({
        name: ".gitignore",
        passed: fs.existsSync(gitignorePath),
        message: fs.existsSync(gitignorePath)
            ? ".gitignore found"
            : ".gitignore is missing",
    });
    // Git repository
    const gitPath = path.join(projectPath, ".git");
    checks.push({
        name: "Git",
        passed: fs.existsSync(gitPath),
        message: fs.existsSync(gitPath)
            ? "Git repository detected"
            : "Git repository not detected",
    });
    return checks;
}
