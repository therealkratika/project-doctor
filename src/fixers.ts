import fs from "node:fs";
import path from "node:path";

export interface FixResult {
  name: string;
  fixed: boolean;
  message: string;
}

export function runFixes(): FixResult[] {
  const projectPath = process.cwd();

  const results: FixResult[] = [];

  // --------------------------------
  // Fix README
  // --------------------------------

  const readmePath = path.join(
    projectPath,
    "README.md",
  );

  if (!fs.existsSync(readmePath)) {
    const projectName =
      path.basename(projectPath);

    const readmeContent = `# ${projectName}

## Description

This project was analyzed by Project Doctor.

## Installation

\`\`\`bash
npm install
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Build

\`\`\`bash
npm run build
\`\`\`
`;

    try {
      fs.writeFileSync(
        readmePath,
        readmeContent,
        "utf-8",
      );

      results.push({
        name: "README",
        fixed: true,
        message: "Created missing README.md",
      });
    } catch {
      results.push({
        name: "README",
        fixed: false,
        message: "Could not create README.md",
      });
    }
  } else {
    results.push({
      name: "README",
      fixed: false,
      message: "README.md already exists",
    });
  }

  // --------------------------------
  // Fix .gitignore
  // --------------------------------

  const gitignorePath = path.join(
    projectPath,
    ".gitignore",
  );

  if (!fs.existsSync(gitignorePath)) {
    const gitignoreContent = `node_modules/
dist/
build/
.next/
coverage/
.env
.env.local
.DS_Store
`;

    try {
      fs.writeFileSync(
        gitignorePath,
        gitignoreContent,
        "utf-8",
      );

      results.push({
        name: ".gitignore",
        fixed: true,
        message: "Created missing .gitignore",
      });
    } catch {
      results.push({
        name: ".gitignore",
        fixed: false,
        message: "Could not create .gitignore",
      });
    }
  } else {
    results.push({
      name: ".gitignore",
      fixed: false,
      message: ".gitignore already exists",
    });
  }

  return results;
}
