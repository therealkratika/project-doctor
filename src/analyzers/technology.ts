interface TechnologyResult {
  framework: string;
  language: string;
  styling: string;
  database: string;
  orm: string;
}

export function analyzeTechnology(
  dependencies: Record<string, string>,
  devDependencies: Record<string, string>,
): TechnologyResult {
  const allDependencies = {
    ...dependencies,
    ...devDependencies,
  };

  // --------------------------------
  // Framework
  // --------------------------------

  let framework = "Unknown";

  if (has(allDependencies, "next")) {
    framework = "Next.js";
  } else if (has(allDependencies, "nuxt")) {
    framework = "Nuxt";
  } else if (has(allDependencies, "@angular/core")) {
    framework = "Angular";
  } else if (has(allDependencies, "@sveltejs/kit")) {
    framework = "SvelteKit";
  } else if (has(allDependencies, "@remix-run/react")) {
    framework = "Remix";
  } else if (has(allDependencies, "astro")) {
    framework = "Astro";
  } else if (has(allDependencies, "gatsby")) {
    framework = "Gatsby";
  } else if (has(allDependencies, "@nestjs/core")) {
    framework = "NestJS";
  } else if (has(allDependencies, "express")) {
    framework = "Express";
  } else if (has(allDependencies, "fastify")) {
    framework = "Fastify";
  } else if (has(allDependencies, "koa")) {
    framework = "Koa";
  } else if (has(allDependencies, "hapi")) {
    framework = "Hapi";
  } else if (has(allDependencies, "react")) {
    framework = "React";
  } else if (has(allDependencies, "vue")) {
    framework = "Vue";
  } else if (has(allDependencies, "svelte")) {
    framework = "Svelte";
  } else if (has(allDependencies, "solid-js")) {
    framework = "SolidJS";
  } else if (has(allDependencies, "preact")) {
    framework = "Preact";
  } else if (has(allDependencies, "electron")) {
    framework = "Electron";
  } else if (has(allDependencies, "react-native")) {
    framework = "React Native";
  }

  // --------------------------------
  // Language
  // --------------------------------

  let language = "JavaScript";

  if (has(allDependencies, "typescript")) {
    language = "TypeScript";
  }

  // --------------------------------
  // Styling
  // --------------------------------

  let styling = "Unknown";

  if (has(allDependencies, "tailwindcss")) {
    styling = "Tailwind CSS";
  } else if (has(allDependencies, "bootstrap")) {
    styling = "Bootstrap";
  } else if (has(allDependencies, "@chakra-ui/react")) {
    styling = "Chakra UI";
  } else if (has(allDependencies, "@mui/material")) {
    styling = "Material UI";
  } else if (has(allDependencies, "antd")) {
    styling = "Ant Design";
  } else if (has(allDependencies, "styled-components")) {
    styling = "styled-components";
  } else if (has(allDependencies, "@emotion/react")) {
    styling = "Emotion";
  } else if (has(allDependencies, "sass")) {
    styling = "Sass";
  } else if (has(allDependencies, "less")) {
    styling = "Less";
  } else if (has(allDependencies, "bulma")) {
    styling = "Bulma";
  } else if (has(allDependencies, "materialize-css")) {
    styling = "Materialize CSS";
  }

  // --------------------------------
  // Database
  // --------------------------------

  let database = "Unknown";

  if (
    has(allDependencies, "mongoose") ||
    has(allDependencies, "mongodb")
  ) {
    database = "MongoDB";
  } else if (
    has(allDependencies, "pg") ||
    has(allDependencies, "postgres")
  ) {
    database = "PostgreSQL";
  } else if (
    has(allDependencies, "mysql") ||
    has(allDependencies, "mysql2")
  ) {
    database = "MySQL";
  } else if (
    has(allDependencies, "mariadb")
  ) {
    database = "MariaDB";
  } else if (
    has(allDependencies, "sqlite3") ||
    has(allDependencies, "better-sqlite3")
  ) {
    database = "SQLite";
  } else if (
    has(allDependencies, "redis") ||
    has(allDependencies, "ioredis")
  ) {
    database = "Redis";
  } else if (
    has(allDependencies, "cassandra-driver")
  ) {
    database = "Cassandra";
  } else if (
    has(allDependencies, "oracledb")
  ) {
    database = "Oracle";
  } else if (
    has(allDependencies, "mssql")
  ) {
    database = "Microsoft SQL Server";
  }

  // --------------------------------
  // ORM / ODM
  // --------------------------------

  let orm = "None";

  if (
    has(allDependencies, "prisma") ||
    has(allDependencies, "@prisma/client")
  ) {
    orm = "Prisma";
  } else if (
    has(allDependencies, "drizzle-orm")
  ) {
    orm = "Drizzle";
  } else if (
    has(allDependencies, "typeorm")
  ) {
    orm = "TypeORM";
  } else if (
    has(allDependencies, "sequelize")
  ) {
    orm = "Sequelize";
  } else if (
    has(allDependencies, "mongoose")
  ) {
    orm = "Mongoose";
  } else if (
    has(allDependencies, "knex")
  ) {
    orm = "Knex";
  } else if (
    has(allDependencies, "objection")
  ) {
    orm = "Objection.js";
  } else if (
    has(allDependencies, "mikro-orm")
  ) {
    orm = "MikroORM";
  }

  return {
    framework,
    language,
    styling,
    database,
    orm,
  };
}

// --------------------------------
// Check dependency existence
// --------------------------------

function has(
  dependencies: Record<string, string>,
  dependency: string,
): boolean {
  return Object.prototype.hasOwnProperty.call(
    dependencies,
    dependency,
  );
}

