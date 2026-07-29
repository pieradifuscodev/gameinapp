import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const evt = await prisma.event.findFirst()
  console.log(evt?.id)
}
main()
