import prisma from "../prismaClient.js";

export const createResearchPaper = async (req, res) => {
  try {
    const { authorName, paperName, description } = req.body;

    if (!authorName || !paperName || !description) {
      return res
        .status(400)
        .json({
          error: "Author name, Paper name, and description are required",
        });
    }

    const newPaper = await prisma.researchPaper.create({
      data: {
        authorName,
        paperName,
        description,
      },
    });

    res.status(200).json(newPaper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating research paper" }); // Send error response
  }
};
