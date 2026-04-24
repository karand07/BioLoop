import { prisma } from './src/lib/prisma.js';

async function check() {
  const order = await prisma.order.findUnique({
    where: { order_id: 3 },
    include: { pickup_schedule: true }
  });
  console.log(JSON.stringify(order, null, 2));
  process.exit(0);
}
check();
