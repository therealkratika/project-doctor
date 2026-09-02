#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { analyzeProject } from "./analyzers/project.js";
import { analyzePackage } from "./analyzers/package.js";
import { analyzeDependencies } from "./analyzers/dependencies.js";
import { analyzeSecurity } from "./analyzers/security.js";
import { calculateHealth } from "./analyzers/health.js";
import { runProjectChecks } from "./analyzers/checks.js";
import { analyzeTechnology } from "./analyzers/technology.js";
const program = new Command();
program
    .name("project-doctor")
    .description("A CLI tool that analyzes your projects")
    .version("1.0.0");
program
    .command("doctor")
    .description("Check the health of your project")
    .action(() => {
    // --------------------------------
    // Run project analyzer
    // --------------------------------
    const project = analyzeProject();
    // --------------------------------
    // Header
    // --------------------------------
    console.log(chalk.bold.cyan("🩺 PROJECT DOCTOR"));
    console.log(chalk.gray("━".repeat(40)));
    console.log();
    // --------------------------------
    // Project information
    // --------------------------------
    console.log(chalk.bold("📁 Project"));
    console.log(`   Name: ${project.projectName}`);
    console.log(`   Path: ${project.projectPath}`);
    // --------------------------------
    // Package information
    // --------------------------------
    const packageJson = analyzePackage();
    if (!packageJson) {
        console.log(chalk.yellow("\n⚠️ No package.json found"));
        console.log();
        console.log(chalk.gray("━".repeat(40)));
        return;
    }
    console.log(`   Framework: ${packageJson.framework}`);
    // --------------------------------
    // Technology analysis
    // --------------------------------
    const technology = analyzeTechnology(packageJson.dependencies, packageJson.devDependencies);
    console.log(chalk.bold("\n🧩 Technology"));
    console.log(`   Framework: ${technology.framework}`);
    console.log(`   Language: ${technology.language}`);
    console.log(`   Styling: ${technology.styling}`);
    console.log(`   Database: ${technology.database}`);
    console.log(`   ORM: ${technology.orm}`);
    // --------------------------------
    // Dependency counts
    // --------------------------------
    const productionDependencies = Object.keys(packageJson.dependencies).length;
    const developmentDependencies = Object.keys(packageJson.devDependencies).length;
    console.log(chalk.bold("\n📦 Dependencies"));
    console.log(`   Production: ${productionDependencies}`);
    console.log(`   Development: ${developmentDependencies}`);
    // --------------------------------
    // Project checks
    // --------------------------------
    const projectChecks = runProjectChecks();
    console.log(chalk.bold("\n📋 Project Checks"));
    for (const check of projectChecks) {
        if (check.passed) {
            console.log(chalk.green(`   ✓ ${check.message}`));
        }
        else {
            console.log(chalk.yellow(`   ⚠ ${check.message}`));
        }
    }
    // --------------------------------
    // Dependency analysis
    // --------------------------------
    const dependencyAnalysis = analyzeDependencies(packageJson.dependencies, packageJson.devDependencies);
    console.log(chalk.bold("\n🔍 Dependency Analysis"));
    // Production dependencies
    console.log("\n   Production:");
    if (dependencyAnalysis.unusedDependencies.length === 0) {
        console.log(chalk.green("   ✓ No potentially unused dependencies detected"));
    }
    else {
        console.log(chalk.yellow("   ⚠ Potentially unused:"));
        for (const dependency of dependencyAnalysis.unusedDependencies) {
            console.log(chalk.yellow(`   ⚠ ${dependency}`));
        }
    }
    // Development dependencies
    console.log("\n   Development:");
    if (dependencyAnalysis.unusedDevDependencies.length === 0) {
        console.log(chalk.green("   ✓ No potentially unused devDependencies detected"));
    }
    else {
        console.log(chalk.yellow("   ⚠ Potentially unused:"));
        for (const dependency of dependencyAnalysis.unusedDevDependencies) {
            console.log(chalk.yellow(`   ⚠ ${dependency}`));
        }
    }
    // --------------------------------
    // Security analysis
    // --------------------------------
    const securityAnalysis = analyzeSecurity();
    console.log(chalk.bold("\n🔐 Security"));
    if (securityAnalysis.total === 0) {
        console.log(chalk.green("   ✓ No vulnerabilities detected"));
    }
    else {
        console.log(chalk.yellow(`   ⚠ ${securityAnalysis.total} vulnerabilities detected`));
        const { vulnerabilities } = securityAnalysis;
        if (vulnerabilities.critical > 0) {
            console.log(chalk.red(`   ❌ Critical: ${vulnerabilities.critical}`));
        }
        if (vulnerabilities.high > 0) {
            console.log(chalk.red(`   ❌ High: ${vulnerabilities.high}`));
        }
        if (vulnerabilities.moderate > 0) {
            console.log(chalk.yellow(`   ⚠ Moderate: ${vulnerabilities.moderate}`));
        }
        if (vulnerabilities.low > 0) {
            console.log(chalk.gray(`   ℹ Low: ${vulnerabilities.low}`));
        }
    }
    // --------------------------------
    // Health score
    // --------------------------------
    const health = calculateHealth({
        unusedDependencies: dependencyAnalysis.unusedDependencies.length,
        unusedDevDependencies: dependencyAnalysis.unusedDevDependencies.length,
        vulnerabilities: securityAnalysis.vulnerabilities,
    });
    let scoreColor;
    if (health.score >= 90) {
        scoreColor = chalk.green;
    }
    else if (health.score >= 75) {
        scoreColor = chalk.yellow;
    }
    else {
        scoreColor = chalk.red;
    }
    console.log(chalk.bold("\n❤️ Health Score"));
    console.log(`   ${scoreColor(`${health.score}/100`)} — ${health.status}`);
    // --------------------------------
    // Footer
    // --------------------------------
    console.log();
    console.log(chalk.gray("━".repeat(40)));
});
program.parse();
