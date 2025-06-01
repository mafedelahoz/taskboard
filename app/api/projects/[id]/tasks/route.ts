import { prisma } from '../../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

interface Params {
  params: { projectId: string };
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { title } = await request.json();
    const { projectId } = params;

    if (!title) {
      return NextResponse.json({ error: 'The tittle of the task is mandatory' }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        projectId,
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error('[POST /api/projects/:id/tasks] Error:', error);
    return new NextResponse('Error creating the task', { status: 500 });
  }
}
