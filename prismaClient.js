import { PrismaClient } from "./generated/client/deno/edge.ts";

const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL_PRISMA_ACCELARATE,
      },
    },
  });

export default prisma;
