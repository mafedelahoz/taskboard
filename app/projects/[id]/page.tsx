'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Task {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  tasks: Task[];
}

type PageProps = {
  params: {
    id: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProjectDetails({ params }: PageProps) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const { status } = useSession();
  const router = useRouter();

  const fetchProject = async () => {
    try {
      const res = await fetch(`/api/projects/${params.id}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch project');
      }

      const data = await res.json();
      setProject(data);
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchProject();
    }
  }, [status, router, fetchProject]);

  const toggleTaskStatus = async (taskId: string) => {
    if (!project) return;

    const currentProject = { ...project };

    setProject({
      ...currentProject,
      tasks: currentProject.tasks.map(task =>
        task.id === taskId
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    } as Project);

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
      });

      if (!res.ok) {
        throw new Error('Failed to update task');
        setProject({
          ...currentProject,
          tasks: currentProject.tasks.map(task =>
            task.id === taskId
              ? { ...task, isCompleted: !task.isCompleted }
              : task
          )
        } as Project);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task status');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <main style={{ 
        maxWidth: '900px', 
        margin: '3rem auto',
        textAlign: 'center',
        color: '#fff'
      }}>
        Loading...
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return null; 
  }

  if (!project) {
    return (
      <main style={{ 
        maxWidth: '900px', 
        margin: '3rem auto',
        textAlign: 'center',
        color: '#fff'
      }}>
        <p>Project not found</p>
        <Link 
          href="/"
          style={{
            color: '#fff',
            textDecoration: 'underline',
            display: 'inline-block',
            marginTop: '1rem'
          }}
        >
          Return to Home
        </Link>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: '900px',
        margin: '3rem auto',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '2.5rem 2rem',
        boxSizing: 'border-box',
        minHeight: '80vh',
      }}
    >
      <header
        style={{
          marginBottom: '2.5rem',
          borderBottom: '1px solid #e5e7eb',
          paddingBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <Link
            href="/"
            style={{
              color: '#6B778C',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              padding: '0.5rem',
              borderRadius: '4px',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#F4F5F7' }}
            onMouseOut={e => { e.currentTarget.style.background = 'transparent' }}
          >
            ← Back to Projects
          </Link>
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
            fontWeight: 800,
            color: '#0079bf',
            letterSpacing: '-1px',
            margin: 0,
          }}
        >
          {project.name}
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#555', margin: 0 }}>{project.description}</p>
      </header>
      <section>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <h2 style={{ 
            fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', 
            fontWeight: 700, 
            color: '#222',
            margin: 0,
          }}>
            Tasks
          </h2>
          <Link
            href={`/projects/${params.id}/tasks/new`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.7rem 1.5rem',
              borderRadius: '8px',
              background: 'linear-gradient(90deg, #0079bf 0%, #005fa3 100%)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            }}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" d="M12 5v14m7-7H5"/>
            </svg>
            Add Task
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem',
            alignItems: 'flex-start',
            minHeight: '120px',
          }}
        >
          {project.tasks.length === 0 ? (
            <div
              style={{
                gridColumn: '1 / -1',
                color: '#a0aec0',
                fontStyle: 'italic',
                textAlign: 'center',
                padding: '2rem 0',
                background: '#f7fafc',
                borderRadius: '12px',
                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              No tasks yet.
            </div>
          ) : (
            project.tasks.map((task: Task) => (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task.id)}
                style={{
                  background: '#fafbfc',
                  borderRadius: '12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                  padding: '1.25rem 1.25rem 1rem 1.25rem',
                  borderTop: task.isCompleted ? '5px solid #38b000' : '5px solid #0079bf',
                  position: 'relative',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onMouseOver={e => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.14)';
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      border: '2px solid',
                      background: task.isCompleted ? '#38b000' : '#0079bf',
                      borderColor: task.isCompleted ? '#38b000' : '#0079bf',
                      display: 'inline-block',
                      flexShrink: 0,
                    }}
                  ></span>
                  <span
                    style={{
                      fontSize: '1.15rem',
                      fontWeight: 600,
                      color: task.isCompleted ? '#a0aec0' : '#22223b',
                      textDecoration: task.isCompleted ? 'line-through' : 'none',
                      transition: 'color 0.2s',
                      wordBreak: 'break-word',
                    }}
                  >
                    {task.title}
                  </span>
                </div>
                {task.isCompleted && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.85rem',
                      borderRadius: '999px',
                      background: '#d3f9d8',
                      color: '#38b000',
                      fontWeight: 600,
                      boxShadow: '0 1px 4px rgba(56,176,0,0.07)',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Completed
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}