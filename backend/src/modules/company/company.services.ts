import { prisma } from "../../lib/prisma.js";
import { createCompanyType, updateCompanyType } from "./company.schema.js";

class CompanyServices {
  async create(
    {
      company_name,
      business_type,
      address,
      latitude,
      longitude,
      gst_number,
    }: createCompanyType,
    userId: number,
  ) {
    const company = await prisma.companyProfile.findUnique({
      where: {
        company_id: userId,
      },
    });

    if (company) {
      throw new Error("Company already registered");
    }

    const createCompany = await prisma.companyProfile.create({
      data: {
        company_id: userId,
        company_name,
        business_type,
        address,
        latitude,
        longitude,
        gst_number,
      },
    });

    return createCompany;
  }

  async update(data: updateCompanyType, userId: number) {
    const company = await prisma.companyProfile.findUnique({
      where: {
        company_id: userId,
      },
    });

    if (!company) {
      throw new Error("Invalid User / Company");
    }

    const update = await prisma.companyProfile.update({
      where: {
        company_id: userId,
      },
      data: {
        ...data,
      },
    });

    return update;
  }
}

export const companyServises = new CompanyServices();
