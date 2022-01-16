-- CreateTable
CREATE TABLE "Voucher" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(255) NOT NULL,
    "claimBy" INTEGER,
    "status" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voucher_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Voucher_claimBy_key" ON "Voucher"("claimBy");

-- AddForeignKey
ALTER TABLE "Voucher" ADD CONSTRAINT "Voucher_claimBy_fkey" FOREIGN KEY ("claimBy") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
