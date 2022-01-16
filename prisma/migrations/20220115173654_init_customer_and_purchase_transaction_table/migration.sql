-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "gender" VARCHAR(50) NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "contactNumber" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseTransaction" (
    "id" SERIAL NOT NULL,
    "customerId" INTEGER NOT NULL,
    "totalSpent" DOUBLE PRECISION NOT NULL,
    "totalSaving" DOUBLE PRECISION NOT NULL,
    "transactionAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseTransaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PurchaseTransaction" ADD CONSTRAINT "PurchaseTransaction_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
