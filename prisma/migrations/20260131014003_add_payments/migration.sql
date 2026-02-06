-- CreateEnum
CREATE TYPE "Bank" AS ENUM ('FALABELLA', 'ESTADO', 'CHILE', 'SANTANDER');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'PAYING', 'PAUSED');

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "type" TEXT NOT NULL,
    "bank" "Bank" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PAYING',
    "installments" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
