import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: 'The name is mandatory' }, { status: 400 })
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description: description || '',
      },
    })

    return NextResponse.json(newProject, { status: 201 })
  } catch (error) {
    console.error('[POST /api/projects] Error:', error)
    return new NextResponse('Error creating the project', { status: 500 })
  }
}

export async function GET() {
  return new NextResponse('Posting project', { status: 405 })
}
