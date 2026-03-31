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
}

class WasteListingsServices {
  async create(
    data: wasteListingsType,
    Imgurl: string,
    farmer_id: number,
    category_id: number,
  ) {
    const listing = await prisma.waste_Listings.create({
      data: {
        ...data,
        farmer_id,
        category_id,
        images: Imgurl,
        description: data.description ?? "",
      },
    });

    return listing;
  }

  async update(
    data: updateWasteListingType,
    Imgurl: string,
    category_id: number,
    listing_id: number,
  ) {
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
        ...(Imgurl !== undefined && { images: Imgurl }),
        ...(category_id !== undefined && { category_id }),
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
}

export const wasteCategoryServices = new WasteCategoryServices();
export const wasteListingServices = new WasteListingsServices();
