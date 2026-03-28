-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('small', 'medium', 'large');

-- CreateTable
CREATE TABLE "LogisticsProfile" (
    "logistics_id" INTEGER NOT NULL,
    "vehicle_type" "VehicleType" NOT NULL,
    "vehicle_number" TEXT NOT NULL,
    "service_area" TEXT NOT NULL,

    CONSTRAINT "LogisticsProfile_pkey" PRIMARY KEY ("logistics_id")
);

-- AddForeignKey
ALTER TABLE "LogisticsProfile" ADD CONSTRAINT "LogisticsProfile_logistics_id_fkey" FOREIGN KEY ("logistics_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
