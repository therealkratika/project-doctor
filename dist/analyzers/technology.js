export function analyzeTechnology(dependencies, devDependencies) {
    const allDependencies = {
        ...dependencies,
        ...devDependencies,
    };
    // --------------------------------
    // Framework
    // --------------------------------
    let framework = "Unknown";
    if (allDependencies.next) {
        framework = "Next.js";
    }
    else if (allDependencies.nuxt) {
        framework = "Nuxt";
    }
    else if (allDependencies["@angular/core"]) {
        framework = "Angular";
    }
    else if (allDependencies["@sveltejs/kit"]) {
        framework = "SvelteKit";
    }
    else if (allDependencies.react) {
        framework = "React";
    }
    else if (allDependencies.vue) {
        framework = "Vue";
    }
    else if (allDependencies.svelte) {
        framework = "Svelte";
    }
    else if (allDependencies["@nestjs/core"]) {
        framework = "NestJS";
    }
    else if (allDependencies.express) {
        framework = "Express";
    }
    // --------------------------------
    // Language
    // --------------------------------
    let language = "JavaScript";
    if (allDependencies.typescript) {
        language = "TypeScript";
    }
    // --------------------------------
    // Styling
    // --------------------------------
    let styling = "Unknown";
    if (allDependencies.tailwindcss) {
        styling = "Tailwind CSS";
    }
    else if (allDependencies["sass"]) {
        styling = "Sass";
    }
    else if (allDependencies["styled-components"]) {
        styling = "styled-components";
    }
    else if (allDependencies["@emotion/react"]) {
        styling = "Emotion";
    }
    // --------------------------------
    // Database
    // --------------------------------
    let database = "Unknown";
    if (allDependencies.mongodb ||
        allDependencies.mongoose) {
        database = "MongoDB";
    }
    else if (allDependencies.pg ||
        allDependencies.postgres) {
        database = "PostgreSQL";
    }
    else if (allDependencies.mysql ||
        allDependencies.mysql2) {
        database = "MySQL";
    }
    else if (allDependencies.sqlite3) {
        database = "SQLite";
    }
    else if (allDependencies.redis) {
        database = "Redis";
    }
    // --------------------------------
    // ORM
    // --------------------------------
    let orm = "None";
    if (allDependencies["@prisma/client"]) {
        orm = "Prisma";
    }
    else if (allDependencies.prisma) {
        orm = "Prisma";
    }
    else if (allDependencies.sequelize) {
        orm = "Sequelize";
    }
    else if (allDependencies.typeorm) {
        orm = "TypeORM";
    }
    else if (allDependencies["drizzle-orm"]) {
        orm = "Drizzle";
    }
    else if (allDependencies.mongoose) {
        orm = "Mongoose";
    }
    return {
        framework,
        language,
        styling,
        database,
        orm,
    };
}
