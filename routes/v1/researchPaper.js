import { Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import * as researchPaper from "../../controllers/v1/researchPaper.js";

const router = new Router();

router
  .get("/researchPaper", researchPaper.getResearchPapers)   // Get all research papers
  .post("/researchPaper", researchPaper.createResearchPaper); // Create a new research paper

export const v1ResearchPaperRoutes = router;
