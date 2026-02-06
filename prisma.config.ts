// prisma.config.ts
import { defineConfig } from "prisma/config";
import "dotenv/config";
console.log('Database URL_:', process.env.DATABASE_URL);
export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});