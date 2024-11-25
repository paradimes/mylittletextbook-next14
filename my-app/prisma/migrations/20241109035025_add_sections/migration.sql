-- CreateTable
CREATE TABLE "Section" (
    "id" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Section_topicId_idx" ON "Section"("topicId");

-- CreateIndex
CREATE INDEX "Section_number_idx" ON "Section"("number");

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
