import { prisma } from '../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/auth.config';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to view projects' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { 
        id,
        userId: session.user.id // Asegurarse de que el usuario solo pueda ver sus propios proyectos
      },
      include: { tasks: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to create tasks' },
        { status: 401 }
      );
    }

    const { id: projectId } = await params;
    const body = await req.json();

    if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    // Verificar que el proyecto pertenece al usuario
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        userId: session.user.id
      }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const newTask = await prisma.task.create({
      data: {
        title: body.title.trim(),
        projectId,
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}