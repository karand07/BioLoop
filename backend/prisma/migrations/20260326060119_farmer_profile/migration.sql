-- CreateTable
CREATE TABLE "FarmerProfile" (
    "farmer_id" INTEGER NOT NULL,
    "farm_name" TEXT NOT NULL,
    "farm_address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "land_size_acres" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "FarmerProfile_pkey" PRIMARY KEY ("farmer_id")
);

-- AddForeignKey
ALTER TABLE "FarmerProfile" ADD CONSTRAINT "FarmerProfile_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
