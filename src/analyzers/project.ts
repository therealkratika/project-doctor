import path from "node:path";

interface ProjectInfo {
  projectPath: string;
  projectName: string;
}

export function analyzeProject(): ProjectInfo {
  const projectPath = process.cwd();
  const projectName = path.basename(projectPath);

  return {
    projectPath,
    projectName,
  };
}