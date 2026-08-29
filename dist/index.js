#!/usr/bin/env node
import { Command } from "commander";
import { analyzeProject } from "./analyzers/project.js";
import { analyzePackage } from "./analyzers/package.js";
import { analyzeDependencies } from "./analyzers/dependencies.js";
import { analyzeSecurity } from "./analyzers/security.js";
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
    // Project information
    console.log("📁 Project");
    console.log(`   Name: ${project.projectName}`);
    console.log(`   Path: ${project.projectPath}`);
    // Package information
    if (!packageJson) {
        console.log("\n⚠️ No package.json found");
        return;
    }
    console.log(`   Framework: ${packageJson.framework}`);
    const productionDependencies = Object.keys(packageJson.dependencies).length;
    const developmentDependencies = Object.keys(packageJson.devDependencies).length;
    console.log("\n📦 Dependencies");
    console.log(`   Production: ${productionDependencies}`);
    console.log(`   Development: ${developmentDependencies}`);
    // Dependency analysis
    const dependencyAnalysis = analyzeDependencies(packageJson.dependencies, packageJson.devDependencies);
    console.log("\n🔍 Dependency Analysis");
    console.log("\n   Production:");
    if (dependencyAnalysis.unusedDependencies.length === 0) {
        console.log("   ✓ No potentially unused dependencies detected");
    }
    else {
        console.log("   ⚠ Potentially unused:");
        for (const dependency of dependencyAnalysis.unusedDependencies) {
            console.log(`   ⚠ ${dependency}`);
        }
    }
    console.log("\n   Development:");
    if (dependencyAnalysis.unusedDevDependencies.length === 0) {
        console.log("   ✓ No potentially unused devDependencies detected");
    }
    else {
        console.log("   ⚠ Potentially unused:");
        for (const dependency of dependencyAnalysis.unusedDevDependencies) {
            console.log(`   ⚠ ${dependency}`);
        }
    }
    // Security analysis
    const securityAnalysis = analyzeSecurity();
    console.log("\n🔐 Security");
    if (securityAnalysis.total === 0) {
        console.log("   ✓ No vulnerabilities detected");
    }
    else {
        console.log(`   ⚠ ${securityAnalysis.total} vulnerabilities detected`);
        const { vulnerabilities } = securityAnalysis;
        if (vulnerabilities.critical > 0) {
            console.log(`   ❌ Critical: ${vulnerabilities.critical}`);
        }
        if (vulnerabilities.high > 0) {
            console.log(`   ❌ High: ${vulnerabilities.high}`);
        }
        if (vulnerabilities.moderate > 0) {
            console.log(`   ⚠ Moderate: ${vulnerabilities.moderate}`);
        }
        if (vulnerabilities.low > 0) {
            console.log(`   ℹ Low: ${vulnerabilities.low}`);
        }
    }
});
program.parse();
