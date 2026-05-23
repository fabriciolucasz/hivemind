-- CreateTable
CREATE TABLE "Relato" (
    "id" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "hora" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "tags" TEXT[],
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Relato_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Relato" ADD CONSTRAINT "Relato_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
