import { prisma } from "../../lib/prisma.js";
import {
  updateWasteCategoryType,
  updateWasteListingType,
  wasteCategoryType,
  wasteListingsType,
} from "./waste.schema.js";

class WasteCategoryServices {
  async create({
    name,
    description,
    min_ref_price,
    max_ref_price,
    unit,
  }: wasteCategoryType) {
    const category = await prisma.waste_Category.findUnique({
      where: {
        name,
      },
    });

    if (category) {
      throw new Error("Category Already Exists");
    }

    const newCategory = await prisma.waste_Category.create({
      data: {
        name,
        description: description ?? "",
        min_ref_price,
        max_ref_price,
        unit,
      },
    });

    return newCategory;
  }

  async update(data: updateWasteCategoryType, category_id: number) {
    const wasteCategory = await prisma.waste_Category.findUnique({
      where: {
        category_id,
      },
    });

    if (!wasteCategory) {
      throw new Error("Waste Category Doesn't Exists");
    }

    const updatedWasteCategory = await prisma.waste_Category.update({
      where: {
        category_id,
      },
      data: {
        ...data,
      },
    });
    return updatedWasteCategory;
  }

  async delete(category_id: number) {
    const wasteCategory = await prisma.waste_Category.findUnique({
      where: {
        category_id,
      },
    });

    if (!wasteCategory) {
      throw new Error("Waste Category Doesn't Exists");
    }

    const deleteCategory = await prisma.waste_Category.delete({
      where: {
        category_id,
      },
    });

    return deleteCategory;
  }

  async getAll() {
    return await prisma.waste_Category.findMany({
      orderBy: {
        name: "asc",
      },
    });
  }
}

class WasteListingsServices {
  async create(data: wasteListingsType, farmer_id: number) {
    const listing = await prisma.waste_Listings.create({
      data: {
        ...data,
        images: data.images as string,
        farmer_id,
      },
    });

    return listing;
  }

  async update(data: updateWasteListingType, listing_id: number) {
    const listing = await prisma.waste_Listings.findUnique({
      where: {
        listing_id,
      },
    });

    if (!listing) {
      throw new Error("Listing do not exist");
    }

    const updateListing = await prisma.waste_Listings.update({
      where: {
        listing_id,
      },
      data: {
        ...data,
      },
    });

    return updateListing;
  }

  async delete(listing_id: number) {
    const listing = await prisma.waste_Listings.findUnique({
      where: {
        listing_id,
      },
    });

    if (!listing) {
      throw new Error("Listing do not exist");
    }

    const deactivated = await prisma.waste_Listings.update({
      where: {
        listing_id,
      },
      data: {
        status: "expired",
      },
    });

    return deactivated;
  }

  async getById(listing_id: number) {
    return await prisma.waste_Listings.findUnique({
      where: {
        listing_id,
      },
      include: {
        category: true,
      },
    });
  }

  async getMyListings(farmer_id: number) {
    return await prisma.waste_Listings.findMany({
      where: {
        farmer_id,
      },
      include: {
        category: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async getAllActive() {
    return await prisma.waste_Listings.findMany({
      where: {
        status: "active",
      },
      include: {
        category: true,
        farmer: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
}

export const wasteCategoryServices = new WasteCategoryServices();
export const wasteListingServices = new WasteListingsServices();
