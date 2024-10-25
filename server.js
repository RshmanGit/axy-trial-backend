// server.js
import { config } from "https://deno.land/x/dotenv/mod.ts";
import { Application } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { researchPaperRoutes } from "./routes/route.js"; 

config();

const app = new Application();
const port = 3000;

// Use the research paper routes
app.use(researchPaperRoutes.routes());
app.use(researchPaperRoutes.allowedMethods());

// Define a simple root route
app.use((context) => {
  context.response.body = { message: "Hello from Deno with Oak!" };
});

// Start the server
const startServer = async () => {
  try {
    console.log(`Server is running on port ${port}`);
    await app.listen({ port });
  } catch (err) {
    console.error("Error starting server:", err);
    Deno.exit(1);
  }
};

// Start the server
startServer();
