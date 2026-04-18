-- AlterTable
ALTER TABLE "FarmerProfile" ADD COLUMN     "account_number" TEXT,
ADD COLUMN     "bank_name" TEXT,
ADD COLUMN     "ifsc" TEXT;

-- AlterTable
ALTER TABLE "LogisticsProfile" ADD COLUMN     "account_number" TEXT,
ADD COLUMN     "bank_name" TEXT,
ADD COLUMN     "ifsc" TEXT;
