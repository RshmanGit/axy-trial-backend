// controllers/researchPaperController.js

import prisma from "../prismaClient.js";

// Function to create a new research paper
export const createResearchPaper = async (context) => {
  try {
    const body = await context.request.body().value; // Get the request body

    const { authorName, paperName, description } = body;

    // Validate required fields
    if (!authorName || !paperName || !description) {
      context.response.status = 400; // Bad Request
      context.response.body = {
        error: "Author name, Paper name, and description are required",
      };
      return;
    }

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
    context.response.status = 500; // Internal Server Error
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
