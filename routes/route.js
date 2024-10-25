// routes/researchPaperRoutes.js

import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import * as researchPaperController from "../controllers/researchPaperController.js";

const router = new Router();

// Define your routes with the /api/v1 prefix
router
  .get("/api/v1/researchPapers", researchPaperController.getResearchPapers) // Get all research papers
  .post("/api/v1/createResearchPaper", researchPaperController.createResearchPaper); // Create a new research paper

export const researchPaperRoutes = router; // Export the router
