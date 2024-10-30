// import { config } from "https://deno.land/x/dotenv/mod.ts";
// import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
// import { Server } from "https://deno.land/x/socket_io@0.1.1/mod.ts";
// import { serve } from "https://deno.land/std/http/server.ts";
// import {
//   updateComment,
//   updateCounter,
//   updateViews,
// } from "./controllers/v1/researchPaper.js";
// import { v1ResearchPaperRoutes } from "./routes/v1/researchPaper.js";

// config();

// const port = 8000;
// const app = new Application();
// const router = new Router();
// const io = new Server();

// // CORS middleware for Oak
// app.use(async (context, next) => {
//   context.response.headers.set("Access-Control-Allow-Origin", "*");
//   context.response.headers.set(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS"
//   );
//   context.response.headers.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization"
//   );
//   await next();
// });

// // Define research paper routes
// router.use(
//   "/api/v1",
//   v1ResearchPaperRoutes.routes(),
//   v1ResearchPaperRoutes.allowedMethods()
// );
// app.use(router.routes());
// app.use(router.allowedMethods());

// // Define a simple root route
// app.use((context) => {
//   context.response.body = { message: "You are hitting the wrong URL man" };
// });

// // Socket.IO event listeners
// // io.on("connection", (socket) => {
// //   console.log(`socket ${socket.id} connected`);

// //   socket.on("likedPaper", async (id) => {
// //     try {
// //       const updatedPaper = await updateCounter(id, "likes");
// //       socket.emit("likedPaperResponse", updatedPaper);
// //     } catch (error) {
// //       socket.emit("error", "Error updating likes");
// //     }
// //   });

// //   socket.on("dislikedPaper", async (id) => {
// //     try {
// //       const updatedPaper = await updateCounter(id, "dislikes");
// //       socket.emit("dislikedPaperResponse", updatedPaper);
// //     } catch (error) {
// //       socket.emit("error", "Error updating dislikes");
// //     }
// //   });

// //   socket.on("viewedPaper", async (id) => {
// //     try {
// //       const updatedPaper = await updateViews(id);
// //       socket.emit("viewedPaperResponse", updatedPaper);
// //     } catch (error) {
// //       socket.emit("error", "Error updating views");
// //     }
// //   });

// //   socket.on("commentOnPaper", async (id, comment) => {
// //     try {
// //       const updatedPaper = await updateComment(id, comment);
// //       socket.emit("commentOnPaperResponse", updatedPaper);
// //     } catch (error) {
// //       socket.emit("error", "Error updating comment");
// //     }
// //   });

// //   socket.on("disconnect", (reason) => {
// //     console.log(`socket ${socket.id} disconnected due to ${reason}`);
// //   });
// // });

// // Start both Oak and Socket.IO on the same HTTP server
// const startServer = async () => {
//   try {
//      // Start Oak server
//      const oakServer = app.listen({ port });
//      console.log(`HTTP server running on http://localhost:${port}`);
 
//      // Start Socket.IO server
//     //  const socketServer = serve(io.handler(), { port: 5000 });
 
//      // Wait for both servers to be ready
//     //  await Promise.all([oakServer, socketServer]);
//   } catch (err) {
//     console.error("Error starting server:", err);
//     Deno.exit(1);
//   }
// };

// startServer();
