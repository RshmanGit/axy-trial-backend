-- CreateTable
CREATE TABLE "researchPaper" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "paperName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "comments" TEXT[],
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "researchPaper_pkey" PRIMARY KEY ("id")
);
