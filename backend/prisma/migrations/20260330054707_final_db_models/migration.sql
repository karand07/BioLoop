-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('active', 'sold', 'expired');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('pending', 'negotiating', 'accepted', 'rejected', 'auto_rejected');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('confirmed', 'in_transit', 'delivered', 'closed', 'disputed');

-- CreateEnum
CREATE TYPE "ProposedBy" AS ENUM ('farmer', 'company');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('pending', 'confirmed', 'picked_up', 'delivered');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'captured', 'held', 'released', 'refunded');

-- CreateEnum
CREATE TYPE "PayoutStatus" AS ENUM ('pending', 'processed', 'failed');

-- CreateEnum
CREATE TYPE "RecipientType" AS ENUM ('farmer', 'logistics');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('order', 'payment', 'logistics', 'system');

-- CreateTable
CREATE TABLE "Waste_Category" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "min_ref_price" DECIMAL(10,2) NOT NULL,
    "max_ref_price" DECIMAL(10,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Waste_Category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Waste_Listings" (
    "listing_id" SERIAL NOT NULL,
    "farmer_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "asking_price" DECIMAL(10,2) NOT NULL,
    "description" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "available_from" DATE NOT NULL,
    "status" "ListingStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Waste_Listings_pkey" PRIMARY KEY ("listing_id")
);

-- CreateTable
CREATE TABLE "Order_Request" (
    "request_id" SERIAL NOT NULL,
    "listing_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "farmer_id" INTEGER NOT NULL,
    "requested_quantity" DECIMAL(10,2) NOT NULL,
    "offered_price" DECIMAL(10,2) NOT NULL,
    "message" TEXT,
    "status" "RequestStatus" NOT NULL DEFAULT 'pending',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_Request_pkey" PRIMARY KEY ("request_id")
);

-- CreateTable
CREATE TABLE "Negotiation" (
    "negotiation_id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "proposed_by" "ProposedBy" NOT NULL,
    "proposed_price" DECIMAL(10,2) NOT NULL,
    "message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Negotiation_pkey" PRIMARY KEY ("negotiation_id")
);

-- CreateTable
CREATE TABLE "Order" (
    "order_id" SERIAL NOT NULL,
    "request_id" INTEGER NOT NULL,
    "farmer_id" INTEGER NOT NULL,
    "company_id" INTEGER NOT NULL,
    "final_price" DECIMAL(10,2) NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "delivery_cost" DECIMAL(10,2) NOT NULL,
    "platform_commission" DECIMAL(10,2) NOT NULL,
    "total_amount" DECIMAL(10,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'confirmed',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Pickup_Schedule" (
    "schedule_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "logistics_id" INTEGER NOT NULL,
    "proposed_slots" JSONB NOT NULL,
    "confirmed_slot" TIMESTAMP(3),
    "status" "ScheduleStatus" NOT NULL DEFAULT 'pending',
    "pickup_address" TEXT NOT NULL,
    "delivery_address" TEXT NOT NULL,
    "distance_km" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Pickup_Schedule_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "payment_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "razorpay_order_id" TEXT NOT NULL,
    "razorpay_payment_id" TEXT,
    "amount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "paid_at" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "Payout" (
    "payout_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "recipient_type" "RecipientType" NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "razorpay_payout_id" TEXT,
    "status" "PayoutStatus" NOT NULL DEFAULT 'pending',
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("payout_id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "notification_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_request_id_key" ON "Order"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "Pickup_Schedule_order_id_key" ON "Pickup_Schedule"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_order_id_key" ON "Payment"("order_id");

-- AddForeignKey
ALTER TABLE "Waste_Listings" ADD CONSTRAINT "Waste_Listings_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "FarmerProfile"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waste_Listings" ADD CONSTRAINT "Waste_Listings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "Waste_Category"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Request" ADD CONSTRAINT "Order_Request_listing_id_fkey" FOREIGN KEY ("listing_id") REFERENCES "Waste_Listings"("listing_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Request" ADD CONSTRAINT "Order_Request_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "CompanyProfile"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Request" ADD CONSTRAINT "Order_Request_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "FarmerProfile"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Negotiation" ADD CONSTRAINT "Negotiation_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Order_Request"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "Order_Request"("request_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "FarmerProfile"("farmer_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "CompanyProfile"("company_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pickup_Schedule" ADD CONSTRAINT "Pickup_Schedule_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pickup_Schedule" ADD CONSTRAINT "Pickup_Schedule_logistics_id_fkey" FOREIGN KEY ("logistics_id") REFERENCES "LogisticsProfile"("logistics_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payout" ADD CONSTRAINT "Payout_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
