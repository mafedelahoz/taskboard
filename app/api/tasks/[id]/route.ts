import { prisma } from '../../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get the current task
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Toggle the done status
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        done: !task.done,
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('[PATCH /api/tasks/:id] Error:', error);
    return new NextResponse('Error updating the task', { status: 500 });
  }
} 