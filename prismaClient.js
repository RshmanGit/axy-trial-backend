import { PrismaClient } from "./generated/client/deno/edge.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";
import dotenv from 'dotenv';
// import { config } from 'dotenv';
const env = config();
// dotenv.config();
// config();
// console.log("Database URL:", Deno.env.get("DATABASE_URL"));
// console.log(Deno.env.toObject()) // Add this line before you create the PrismaClient
// const prisma = new PrismaClient();
console.log(env.DATABASE_URL);
const prisma = new PrismaClient({
    datasources: {
      db: {
        url:env.DATABASE_URL
      },
    },
  });

export default prisma;
