-- CreateTable
CREATE TABLE "CompanyProfile" (
    "company_id" INTEGER NOT NULL,
    "company_name" TEXT NOT NULL,
    "business_type" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "gst_number" TEXT,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("company_id")
);

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
