// controllers/researchPaperController.js

import prisma from "../prismaClient.js";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

// Function to create a new research paper
export const createResearchPaper = async (context) => {
  try {
    const body = await context.request.body().value; // Get the request body

    // Define a Zod schema for the request body
    const paperSchema = z.object({
      authorName: z
        .string()
        .min(1, { message: "Author name is required" })
        .refine((val) => !/<\/?[a-z][\s\S]*>/i.test(val), {
          message: "Invalid characters",
        }),
      paperName: z
        .string()
        .min(1, { message: "Paper name is required" })
        .refine((val) => !/<\/?[a-z][\s\S]*>/i.test(val), {
          message: "Invalid characters",
        }),
      description: z
        .string()
        .min(1, { message: "Description is required" })
        .refine((val) => !/<\/?[a-z][\s\S]*>/i.test(val), {
          message: "Invalid characters",
        }),
    });

    const { authorName, paperName, description } = paperSchema.parse(body);

    // Create a new research paper in the database
    const newPaper = await prisma.researchPaper.create({
      data: {
        authorName,
        paperName,
        description,
      },
    });

    context.response.status = 200; // Created
    context.response.body = newPaper; // Return the created paper
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      context.response.status = 422; // Unprocessable Entity
      context.response.body = {
        error: error.errors.map((e) => e.message).join(", "),
      };
    } else {
      context.response.status = 500; // Internal Server Error
      context.response.body = { error: "Error creating research paper" };
    }
    context.response.body = { error: "Error creating research paper" };
  }
};

// Function to get all research papers
export const getResearchPapers = async (context) => {
  try {
    const papers = await prisma.researchPaper.findMany(); // Fetch all research papers
    context.response.status = 200; // OK
    context.response.body = papers; // Return the list of papers
  } catch (error) {
    console.error(error);
    context.response.status = 500; // Internal Server Error
    context.response.body = { error: "Error fetching research papers" };
  }
};
