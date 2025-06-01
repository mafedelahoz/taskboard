import { prisma } from '../../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { tasks: true },
  });

  if (!project) {
    return new NextResponse('Project not found', { status: 404 });
  }

  return NextResponse.json(project);
}