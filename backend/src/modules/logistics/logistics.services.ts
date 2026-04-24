import { prisma } from "../../lib/prisma.js";
import {
  createLogisticsType,
  updateLogisticsType,
} from "./logistics.schema.js";

class LogisticsServices {
  async create(data: createLogisticsType, userId: number) {
    const { vehicle_type, vehicle_number, service_area } = data;
    const vehicle = await prisma.logisticsProfile.findUnique({
      where: {
        logistics_id: userId,
      },
    });

    if (vehicle) {
      throw new Error("logisticsId already registered");
    }

    const createVehicle = await prisma.logisticsProfile.create({
      data: {
        logistics_id: userId,
        vehicle_type,
        vehicle_number,
        service_area,
        account_number: data.account_number,
        ifsc: data.ifsc,
        bank_name: data.bank_name,
      },
    });

    return createVehicle;
  }

  async update(data: updateLogisticsType, userId: number) {
    const vehicle = await prisma.logisticsProfile.findUnique({
      where: {
        logistics_id: userId,
      },
    });

    if (!vehicle) {
      throw new Error("Invalid Logistics Id");
    }

    const updateVehicle = await prisma.logisticsProfile.update({
      where: {
        logistics_id: userId,
      },
      data: {
        ...data,
      },
    });

    return updateVehicle;
  }
}

export const logisticsServices = new LogisticsServices();
