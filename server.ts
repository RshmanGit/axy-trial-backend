import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app); // Create an HTTP server
const io = new Server(server,{
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000" }));
app.get("/api/v1/paper", async (req: Request, res: Response) => {
  try {
    const papers = await prisma.researchPaper.findMany();
    papers.sort((a, b) => (2 * b.likes - b.dislikes) - (2 * a.likes - a.dislikes));
    res.status(200).json(papers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching research papers" });
  }
});
app.post("/api/v1/paper", async (req: Request, res: Response) => {
  try {
    const body = req.body;
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
    const newPaper = await prisma.researchPaper.create({
      data: {
        authorName,
        paperName,
        description,
      },
    });
    io.emit("NewPaperCreated", newPaper);
    res.status(201).json(newPaper); // Created
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(422).json({
        error: error.errors.map((e) => e.message).join(", "),
      });
    } else {
      res.status(500).json({ error: "Error creating research paper" });
    }
  }
});
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("likePaper", async (paperId: string) => {
    // console.log("hiiiiii");
    // console.log(paperId);
    try {
      const updatedPaper = await prisma.researchPaper.update({
        where: {
          id: paperId, // Directly use paperId as a string
        },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
      io.emit("postupdated", updatedPaper); // Notify all clients about the like
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("dislikePaper", async (paperId: string) => {
    try {
      const updatedPaper = await prisma.researchPaper.update({
        where: {
           id: paperId 
          },
        data: {
          dislikes: { 
            increment: 1 
          },
        },
      });
      io.emit("postupdated", updatedPaper); // Notify all clients about the dislike
    } catch (error) {
      console.error(error);
    }
  });
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
