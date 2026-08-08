import chalk from "chalk";
export function printReport(data) {
    const { project, packageJson, technology, projectChecks, dependencyAnalysis, securityAnalysis, health, recommendations, fixes, } = data;
    // --------------------------------
    // Header
    // --------------------------------
    console.log(chalk.bold.cyan("🩺 PROJECT DOCTOR"));
    console.log(chalk.gray("━".repeat(40)));
    console.log();
    // --------------------------------
    // Project
    // --------------------------------
    console.log(chalk.bold("📁 Project"));
    console.log(`   Name: ${project.projectName}`);
    console.log(`   Path: ${project.projectPath}`);
    // --------------------------------
    // Technology
    // --------------------------------
    console.log(chalk.bold("\n🧩 Technology"));
    console.log(`   Framework: ${technology.framework}`);
    console.log(`   Language: ${technology.language}`);
    console.log(`   Styling: ${technology.styling}`);
    console.log(`   Database: ${technology.database}`);
    console.log(`   ORM: ${technology.orm}`);
    // --------------------------------
    // Dependencies
    // --------------------------------
    const productionDependencies = Object.keys(packageJson.dependencies).length;
    const developmentDependencies = Object.keys(packageJson.devDependencies).length;
    console.log(chalk.bold("\n📦 Dependencies"));
    console.log(`   Production: ${productionDependencies}`);
    console.log(`   Development: ${developmentDependencies}`);
    // --------------------------------
    // Project checks
    // --------------------------------
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
    console.log(chalk.bold("\n🔍 Dependency Analysis"));
    // Production dependencies
    console.log("\n   Production:");
    if (dependencyAnalysis.unusedDependencies
        .length === 0) {
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
    if (dependencyAnalysis
        .unusedDevDependencies.length === 0) {
        console.log(chalk.green("   ✓ No potentially unused devDependencies detected"));
    }
    else {
        console.log(chalk.yellow("   ⚠ Potentially unused:"));
        for (const dependency of dependencyAnalysis.unusedDevDependencies) {
            console.log(chalk.yellow(`   ⚠ ${dependency}`));
        }
    }
    // --------------------------------
    // Security
    // --------------------------------
    console.log(chalk.bold("\n🔐 Security"));
    if (securityAnalysis.total === 0) {
        console.log(chalk.green("   ✓ No vulnerabilities detected"));
    }
    else {
        console.log(chalk.yellow(`   ⚠ ${securityAnalysis.total} vulnerabilities detected`));
        const { vulnerabilities, } = securityAnalysis;
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
    // Health Score
    // --------------------------------
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
    // Issues
    // --------------------------------
    const failedChecks = projectChecks.filter((check) => !check.passed);
    if (failedChecks.length > 0) {
        console.log(chalk.bold("\n⚠ Issues"));
        for (const check of failedChecks) {
            console.log(chalk.yellow(`   • ${check.message}`));
        }
    }
    // --------------------------------
    // Recommendations
    // --------------------------------
    if (recommendations.length > 0) {
        console.log(chalk.bold("\n💡 Recommendations"));
        for (const recommendation of recommendations) {
            if (recommendation.type === "warning") {
                console.log(chalk.yellow(`   ⚠ ${recommendation.message}`));
            }
            else if (recommendation.type === "success") {
                console.log(chalk.green(`   ✓ ${recommendation.message}`));
            }
            else {
                console.log(chalk.cyan(`   ℹ ${recommendation.message}`));
            }
            if (recommendation.command) {
                console.log(chalk.gray(`     → ${recommendation.command}`));
            }
        }
    }
    // --------------------------------
    // Fixes
    // --------------------------------
    const appliedFixes = fixes.filter((fix) => fix.fixed);
    if (appliedFixes.length > 0) {
        console.log(chalk.bold("\n🔧 Fixes Applied"));
        for (const fix of appliedFixes) {
            console.log(chalk.green(`   ✓ ${fix.message}`));
        }
    }
    // --------------------------------
    // Footer
    // --------------------------------
    console.log();
    console.log(chalk.gray("━".repeat(40)));
}
