// controllers/researchPaperController.js

import prisma from "../../prismaClient.js";
import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

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
    if (error.issues) {
      context.response.status = 422; // Unprocessable Entity
      context.response.body = {
        error: error.issues.map((e) => e.message).join(", "),
      };
    } else {
      context.response.status = 500; // Internal Server Error
      context.response.body = { error: "Error creating research paper" };
    }
  }
};

export const updateCounter = async (id, field) => {
  try {
    // Schema to validate that the id is a valid UUID
    const idSchema = z.string().uuid({ message: "Invalid UUID format" });
    idSchema.parse(id);

    // Update the specified field (likes or dislikes) by incrementing it by 1
    const updatedPaper = await prisma.researchPaper.update({
      where: { id },
      data: {
        [field]: {
          increment: 1,
        },
      },
    });

    return updatedPaper;
  } catch (error) {
    console.error(error);
    // Check if there are validation errors and format them for output
    if (error.issues) {
      const validationErrors = {
        error: error.issues.map((e) => e.message).join(", "),
      };
      console.log(validationErrors);
      throw new Error(validationErrors.error);
    } else {
      // If other types of errors occur, throw them
      throw error;
    }
  }
};

export const updateComment = async (id, comment) => {
  try {
    // Define schema to validate both id as a UUID and comment as a non-empty string with no HTML tags
    const idSchema = z.object({
      id: z.string().uuid({ message: "Invalid UUID format" }),
      comment: z
        .string()
        .min(1, { message: "Comment is required" })
        .refine((val) => !/<\/?[a-z][\s\S]*>/i.test(val), {
          message: "Invalid characters",
        }),
    });

    // Parse and validate both id and comment
    idSchema.parse({ id, comment });

    // Retrieve the existing comments for the specified research paper
    const existingPaper = await prisma.researchPaper.findUnique({
      where: { id },
      select: { comments: true },
    });

    // Throw an error if the research paper is not found
    if (!existingPaper) {
      throw new Error("Research paper not found");
    }

    // Update the comments by appending the new comment to the existing array
    const updatedPaper = await prisma.researchPaper.update({
      where: { id },
      data: {
        comments: {
          set: [...existingPaper.comments, comment],
        },
      },
    });

    return updatedPaper;
  } catch (error) {
    console.error(error);
    // Handle validation errors and format them for output
    if (error.issues) {
      const validationErrors = {
        error: error.issues.map((e) => e.message).join(", "),
      };
      console.log(validationErrors);
      throw new Error(validationErrors.error);
    } else {
      // Throw any other type of error
      throw error;
    }
  }
};

export const updateViews = async (id) => {
  try {
    // Schema to validate that the id is a valid UUID
    const idSchema = z.object({
      id: z.string().uuid({ message: "Invalid UUID format" }),
    });

    // Parse and validate the id
    idSchema.parse({ id });

    // Increment the view count for the specified research paper
    const updatedPaper = await prisma.researchPaper.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return updatedPaper;
  } catch (error) {
    console.error(error);
    // Check for validation errors and format them for output
    if (error.issues) {
      const validationErrors = {
        error: error.issues.map((e) => e.message).join(", "),
      };
      console.log(validationErrors);
      throw new Error(validationErrors.error);
    } else {
      // Throw any other type of error
      throw error;
    }
  }
};

