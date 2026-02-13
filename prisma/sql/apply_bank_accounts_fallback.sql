DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'Bank') THEN
    CREATE TYPE "Bank" AS ENUM ('FALABELLA', 'ESTADO', 'CHILE', 'SANTANDER');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "BankAccount" (
  "id" SERIAL NOT NULL,
  "bank" "Bank" NOT NULL,
  "totalLimit" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalDebt" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "debtCreditCard" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "debtCreditLine" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "debtAdvance" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "debtConsumerCredit" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "totalInstallments" INTEGER NOT NULL DEFAULT 0,
  "paidInstallments" INTEGER NOT NULL DEFAULT 0,
  "paymentStatus" TEXT,
  "paymentDate" TEXT,
  "statementDate" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BankAccount_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "BankAccount_bank_key" ON "BankAccount"("bank");

ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "totalLimit" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "totalDebt" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "debtCreditCard" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "debtCreditLine" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "debtAdvance" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "debtConsumerCredit" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "totalInstallments" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "paidInstallments" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "paymentStatus" TEXT;
ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "paymentDate" TEXT;
ALTER TABLE "BankAccount" ADD COLUMN IF NOT EXISTS "statementDate" TEXT;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'BankAccount'
      AND column_name = 'name'
  ) THEN
    EXECUTE 'ALTER TABLE "BankAccount" ALTER COLUMN "name" SET DEFAULT ''''';
  END IF;
END $$;

UPDATE "BankAccount"
SET "totalDebt" =
  COALESCE("debtCreditCard", 0) +
  COALESCE("debtCreditLine", 0) +
  COALESCE("debtAdvance", 0) +
  COALESCE("debtConsumerCredit", 0);

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'BankAccount'
      AND column_name = 'totalCredit'
  ) THEN
    EXECUTE 'UPDATE "BankAccount" SET "totalLimit" = COALESCE("totalLimit", "totalCredit", 0)';
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'BankAccount'
      AND column_name = 'name'
  ) THEN
    EXECUTE '
      INSERT INTO "BankAccount" ("bank", "totalLimit", "totalDebt", "debtCreditCard", "debtCreditLine", "debtAdvance", "debtConsumerCredit", "totalInstallments", "paidInstallments", "paymentStatus", "paymentDate", "statementDate", "updatedAt", "name")
      VALUES
        (''FALABELLA'', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NOW(), ''BANCO FALABELLA''),
        (''ESTADO'', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NOW(), ''BANCO ESTADO''),
        (''CHILE'', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NOW(), ''BANCO DE CHILE''),
        (''SANTANDER'', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NOW(), ''BANCO SANTANDER'')
      ON CONFLICT ("bank") DO NOTHING
    ';
  ELSE
    EXECUTE '
      INSERT INTO "BankAccount" ("bank", "totalLimit", "totalDebt", "debtCreditCard", "debtCreditLine", "debtAdvance", "debtConsumerCredit", "totalInstallments", "paidInstallments", "paymentStatus", "paymentDate", "statementDate", "updatedAt")
      VALUES
        (''FALABELLA'', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NOW()),
        (''ESTADO'', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NOW()),
        (''CHILE'', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NOW()),
        (''SANTANDER'', 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, NOW())
      ON CONFLICT ("bank") DO NOTHING
    ';
  END IF;
END $$;
