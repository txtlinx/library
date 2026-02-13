-- CreateTable
CREATE TABLE "BankAccount" (
    "id" SERIAL NOT NULL,
    "bank" "Bank" NOT NULL,
    "totalLimit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "paymentStatus" TEXT,
    "paymentDate" TEXT,
    "statementDate" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BankAccount_bank_key" ON "BankAccount"("bank");
