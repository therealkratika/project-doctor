import path from "node:path";
export function analyzeProject() {
    const projectPath = process.cwd();
    const projectName = path.basename(projectPath);
    return {
        projectPath,
        projectName,
    };
}
