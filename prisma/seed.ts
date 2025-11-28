import { prisma } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

async function main() {
  console.log("Seeding database...")

  try {
    // Create admin user
    const adminUser = await prisma.user.upsert({
      where: { email: "admin@glowing.com" },
      update: {},
      create: {
        name: "Admin",
        email: "admin@glowing.com",
        phone: "0000000000",
        password: await hashPassword("admin123"),
        role: "admin",
      },
    })

    console.log("✓ Admin user created:", adminUser.email)

    // Create sample customer
    const customerUser = await prisma.user.upsert({
      where: { email: "customer@example.com" },
      update: {},
      create: {
        name: "John Doe",
        email: "customer@example.com",
        phone: "1234567890",
        password: await hashPassword("password123"),
        role: "customer",
      },
    })

    console.log("✓ Customer user created:", customerUser.email)

    console.log("✅ Database seeding completed!")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
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
