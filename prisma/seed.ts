import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  for (let i = 0; i < 15; i++){
    const startDate = new Date(2024, 2, Math.floor(Math.random() * 10 + 1));
    const endDate = new Date(2024, 2, Math.floor(startDate.getDay() + (Math.random() * 20 + 1)));
    await prisma.rentals.create({
      data: {
        car_id: Math.floor(Math.random() * 11 + 1),
        start_date: startDate,
        end_date: endDate
      }
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
