import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const projectsRaw = await prisma.project.findMany({
      include: { tasks: true },
    });

    interface Task {
      id: string;
      title: string;
      done: boolean;
      projectId: string | null;
    }

    interface ProjectRaw {
      id: string;
      name: string;
      description: string;
      createdAt: Date;
      tasks: Task[];
    }

    interface Project {
      id: string;
      name: string;
      description: string;
      createdAt: Date;
      tasks: Task[];
    }

    const projects: Project[] = projectsRaw.map((p: ProjectRaw): Project => ({
      id: p.id,
      name: p.name,
      description: p.description,
      createdAt: p.createdAt,
      tasks: p.tasks,
    }));

    console.log('[GET /api/projects] Projects:', projects);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('[GET /api/projects] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name) {
      return NextResponse.json({ error: 'The name of the project is mandatory' }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
        description: description || '',
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('[POST /api/projects] Error:', error);
    return new NextResponse('Error creating the project', { status: 500 });
  }
}
