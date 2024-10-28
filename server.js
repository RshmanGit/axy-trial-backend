import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { v1ResearchPaperRoutes } from "./routes/v1/researchPaper.js";
import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";
import { serve } from "https://deno.land/std/http/server.ts";

import { updateComment, updateCounter, updateViews } from "./controllers/v1/researchPaper.js";

config();

const app = new Application();
const port = 8000;

// CORS middleware for Oak
app.use(async (context, next) => {
  context.response.headers.set("Access-Control-Allow-Origin", "*");
  context.response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  context.response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  await next();
});

// Use the research paper routes
app.use(v1ResearchPaperRoutes.prefix("/api/v1").routes());
app.use(v1ResearchPaperRoutes.allowedMethods());

// Define a simple root route
app.use((context) => {
  context.response.body = { message: "You are hitting the wrong url" };
});

// Initialize Socket.IO server
const io = new Server();
io.on("connection", (socket) => {
  console.log(`socket ${socket.id} connected`);

  socket.on("likedPaper", async (id) => {
    try {
      const updatedPaper = await updateCounter(id, "likes");
      socket.emit("likedPaperResponse", updatedPaper);
    } catch (error) {
      socket.emit("error", "Error updating likes");
    }
  });

  socket.on("dislikedPaper", async (id) => {
    try {
      const updatedPaper = await updateCounter(id, "dislikes");
      socket.emit("dislikedPaperResponse", updatedPaper);
    } catch (error) {
      socket.emit("error", "Error updating dislikes");
    }
  });

  socket.on("viewedPaper", async (id) => {
    try {
      const updatedPaper = await updateViews(id);
      socket.emit("viewedPaperResponse", updatedPaper);
    } catch (error) {
      socket.emit("error", "Error updating views");
    }
  });

  socket.on("commentOnPaper", async (id, comment) => {
    try {
      const updatedPaper = await updateComment(id, comment);
      socket.emit("commentOnPaperResponse", updatedPaper);
    } catch (error) {
      socket.emit("error", "Error updating comment");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} disconnected due to ${reason}`);
  });
});

// Start the server and attach Socket.IO to it
const startServer = async () => {
  try {
    console.log(`Server is running on port ${port}`);
    await serve(`:${port}`, app.handle.bind(app));
    io.attach(app); // Attach Socket.IO to Oak
  } catch (err) {
    console.error("Error starting server:", err);
    Deno.exit(1);
  }
};

startServer();
