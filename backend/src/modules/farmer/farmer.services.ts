import { prisma } from "../../lib/prisma.js";
import { createFarmerType, updateFarmerType } from "./farmer.schema.js";

class FarmerServices {
  async create(data: createFarmerType, userId: number) {
    const {
      farm_name,
      farm_address,
      city,
      state,
      latitude,
      longitude,
      land_size_acres,
    } = data;
    const farmer = await prisma.farmerProfile.findUnique({
      where: {
        farmer_id: userId,
      },
    });

    if (farmer) {
      throw new Error("Farmer already registered");
    }

    const createdFarmer = await prisma.farmerProfile.create({
      data: {
        farmer_id: userId,
        farm_name,
        farm_address,
        city,
        state,
        latitude,
        longitude,
        land_size_acres,
        account_number: data.account_number,
        ifsc: data.ifsc,
        bank_name: data.bank_name,
      },
    });

    return createdFarmer;
  }

  async update(data: updateFarmerType, userId: number) {
    const farmer = await prisma.farmerProfile.findUnique({
      where: {
        farmer_id: userId,
      },
    });

    if (!farmer) {
      throw new Error("Invalid User / Farmer");
    }

    const update = await prisma.farmerProfile.update({
      where: {
        farmer_id: userId,
      },
      data: {
        ...data,
      },
    });

    return update;
  }
}

export const farmerServises = new FarmerServices();
