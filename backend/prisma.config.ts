import "dotenv/config";
import { env, PrismaConfig } from "prisma/config";

export default {
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
} satisfies PrismaConfig;