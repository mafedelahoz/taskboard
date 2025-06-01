import { prisma } from '../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const data = await req.json()

  const task = await prisma.task.create({
    data: {
      title: data.title,
      projectId: data.projectId
    }
  })

  return NextResponse.json(task)
}
