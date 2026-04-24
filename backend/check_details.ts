import { prisma } from './src/lib/prisma.js';

async function checkDetails() {
  const farmer = await prisma.farmerProfile.findUnique({ where: { farmer_id: 1 } });
  const logistics = await prisma.logisticsProfile.findUnique({ where: { logistics_id: 4 } });
  
  console.log("Farmer Bank Details:", {
    account: farmer?.account_number,
    ifsc: farmer?.ifsc
  });
  
  console.log("Logistics Bank Details:", {
    account: logistics?.account_number,
    ifsc: logistics?.ifsc
  });
  
  process.exit(0);
}
checkDetails();
