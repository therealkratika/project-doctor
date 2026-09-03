import fs from "node:fs";
import path from "node:path";

export interface FixResult {
  name: string;
  fixed: boolean;
  message: string;
}

export function fixGitignore(): FixResult {
  const projectPath = process.cwd();
  const gitignorePath = path.join(
    projectPath,
    ".gitignore",
  );

  // .gitignore already exists
  if (fs.existsSync(gitignorePath)) {
    return {
      name: ".gitignore",
      fixed: false,
      message: ".gitignore already exists",
    };
  }

  const content = `# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build output
dist/
build/
.next/
out/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store

# IDE
.vscode/
.idea/
`;

  fs.writeFileSync(
    gitignorePath,
    content,
    "utf-8",
  );

  return {
    name: ".gitignore",
    fixed: true,
    message: "Created .gitignore",
  };
}

export function runFixes(): FixResult[] {
  return [
    fixGitignore(),
  ];
}

