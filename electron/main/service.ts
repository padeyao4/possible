import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createProject() {
  await prisma.task.deleteMany({})
  await prisma.project.deleteMany({})
  const project1 = await prisma.project.create({
    data: {
      name: 'hello',
      createdTime: new Date(),
      offsetX: 0,
      offsetY: 0
    }
  })
  await prisma.task.create({
    data: {
      name: 'task1',
      dataIndex: 0,
      projectId: project1.id,
      priority: 0
    }
  })
}
