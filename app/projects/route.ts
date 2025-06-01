import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import { getServerSession } from 'next-auth'

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json()
    const { name, description } = body

    if (!name) {
      return NextResponse.json({ error: 'The name is mandatory' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description: description || '',
        user: {
          connect: {
            id: user.id
          }
        }
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
