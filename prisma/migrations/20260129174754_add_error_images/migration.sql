-- CreateTable
CREATE TABLE "ErrorImage" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "errorId" INTEGER NOT NULL,

    CONSTRAINT "ErrorImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ErrorImage" ADD CONSTRAINT "ErrorImage_errorId_fkey" FOREIGN KEY ("errorId") REFERENCES "ErrorEntry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
