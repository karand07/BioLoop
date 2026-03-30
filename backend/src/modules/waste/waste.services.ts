import { prisma } from "../../lib/prisma.js";
import { updateWasteCategoryType, wasteCategoryType } from "./waste.schema.js";

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
        description: description || "",
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

export const wasteCategoryServices = new WasteCategoryServices();
