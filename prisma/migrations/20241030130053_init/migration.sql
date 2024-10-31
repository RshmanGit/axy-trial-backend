-- CreateTable
CREATE TABLE "ResearchPaper" (
    "id" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "paperName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ResearchPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,

    CONSTRAINT "about_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "about" ADD CONSTRAINT "about_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "ResearchPaper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
