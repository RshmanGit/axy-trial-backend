import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
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
    const papers = await prisma.researchPaper.findMany({
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });
    papers.sort((a: any, b: any) => {
      const aCommentsCount = a._count.comments || 0;
      const aScore = a.likes - a.dislikes + aCommentsCount; 
      const bCommentsCount = b._count.comments || 0; 
      const bScore = b.likes - b.dislikes + bCommentsCount;
      
      // Sort in descending order
      return bScore - aScore; 
    });

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
app.post("/api/v1/paper/:paperId/comment", async (req: Request, res: Response) => {
  try {
    const paperId = req.params.paperId; 
    const body = req.body;
    const commentSchema = z.object({
      name: z.string().min(1, { message: "Name is required" }),
      content: z.string().min(1, { message: "Comment content is required" }),
    });
    const { name, content } = commentSchema.parse(body);
    const newComment = await prisma.about.create({
      data: {
        name,
        content,
        paper: {
          connect: { id: paperId },
        },
      },
    });
    io.emit("commentCreated", newComment);
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(422).json({
        error: error.errors.map((e) => e.message).join(", "),
      });
    } else {
      res.status(500).json({ error: "Error creating comment" });
    }
  }
});
app.get("/api/v1/paper/:paperId/comment", async (req: Request, res: Response) => {
  try{
  const paperId: string = req.params.paperId; 
  const comments = await prisma.about.findMany({
    where: {
      paperId: paperId,
    },
  });
  res.status(200).json(comments);
  }
  catch(error){
    console.error(error);
    res.status(500).json({ error: "Error fetching comments" });
  }
});

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);
  socket.on("likePaper", async (paperId: string) => {
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
