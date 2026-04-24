import { prisma } from './src/lib/prisma.js';

async function fix() {
  const desynced = await prisma.order.findMany({
    where: {
      status: 'in_transit',
      pickup_schedule: {
        status: 'delivered'
      }
    }
  });

  console.log(`Found ${desynced.length} desynced orders. Fixing...`);

  for (const order of desynced) {
    await prisma.order.update({
      where: { order_id: order.order_id },
      data: { status: 'delivered' }
    });
    console.log(`Fixed Order #${order.order_id}`);
  }

  process.exit(0);
}
fix();
