#!/usr/bin/env node
import { Command } from "commander";
import { analyzeProject } from "./analyzers/project.js";
import { analyzePackage } from "./analyzers/package.js";
import { analyzeDependencies } from "./analyzers/dependencies.js";
const program = new Command();
program
    .name("project-doctor")
    .description("A CLI tool that analyzes your projects")
    .version("1.0.0");
program
    .command("doctor")
    .description("Check the health of your project")
    .action(() => {
    const project = analyzeProject();
    const packageJson = analyzePackage();
    console.log("🩺 Checking your project...\n");
    console.log("📁 Project");
    console.log(`   Name: ${project.projectName}`);
    console.log(`   Path: ${project.projectPath}`);
    if (packageJson) {
        console.log(`   Framework: ${packageJson.framework}`);
        const productionDependencies = Object.keys(packageJson.dependencies).length;
        const developmentDependencies = Object.keys(packageJson.devDependencies).length;
        console.log("\n📦 Dependencies");
        console.log(`   Production: ${productionDependencies}`);
        console.log(`   Development: ${developmentDependencies}`);
        const dependencyAnalysis = analyzeDependencies(packageJson.dependencies);
        console.log("\n🔍 Dependency Analysis");
        if (dependencyAnalysis.unusedDependencies.length === 0) {
            console.log("   ✓ No unused dependencies detected");
        }
        else {
            console.log("   ⚠ Potentially unused:");
            for (const dependency of dependencyAnalysis.unusedDependencies) {
                console.log(`   ❌ ${dependency}`);
            }
        }
    }
    else {
        console.log("\n⚠️ No package.json found");
    }
});
program.parse();
