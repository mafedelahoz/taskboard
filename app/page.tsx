'use client';

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

type Task = {
  id: string
  title: string
  isCompleted: boolean
  projectId: string | null
}

type Project = {
  id: string
  name: string
  description: string
  createdAt: string
  tasks: Task[]
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const { status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchProjects()
    }
  }, [status])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', {
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch projects')
      }
      
      setProjects(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskStatus = async (taskId: string, projectId: string) => {
    // Optimistic update
    setProjects(projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          tasks: project.tasks.map(task => 
            task.id === taskId 
              ? { ...task, isCompleted: !task.isCompleted }
              : task
          )
        }
      }
      return project
    }))

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
      })

      if (!res.ok) {
        throw new Error('Failed to update task')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      setProjects(projects.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            tasks: project.tasks.map(task => 
              task.id === taskId 
                ? { ...task, isCompleted: !task.isCompleted }
                : task
            )
          }
        }
        return project
      }))
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="loading-screen">
        <style jsx>{`
          .loading-screen {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(to bottom right, #0079bf, #005fa3);
          }
          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null
  }

  return (
    <>
      <style jsx>{`
        main {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(to bottom right, #0079bf, #005fa3);
        }

        .header {
          max-width: 1200px;
          margin: 0 auto 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 1rem;
        }

        h1 {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .new-project-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 2px solid rgba(255, 255, 255, 0.3);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .new-project-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .new-project-btn:active {
          transform: translateY(0);
        }

        .signout-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .signout-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .board {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .column {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          min-height: 200px;
          display: flex;
          flex-direction: column;
        }

        .column-header {
          font-size: 1.25rem;
          font-weight: 600;
          color: #172b4d;
          margin-bottom: 0.5rem;
        }

        .column-desc {
          color: #6b778c;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
        }

        .tasks-list {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
        }

        .task {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f4f5f7;
          border-radius: 6px;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .task:hover {
          background: #e9ecef;
        }

        .task.done {
          background: #e3fcef;
          color: #057a55;
        }

        .task-checkbox {
          width: 16px;
          height: 16px;
          border: 2px solid #dfe1e6;
          border-radius: 4px;
          position: relative;
        }

        .task.done .task-checkbox {
          border-color: #057a55;
          background: #057a55;
        }

        .task.done .task-checkbox:after {
          content: '';
          position: absolute;
          left: 4px;
          top: 1px;
          width: 5px;
          height: 9px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .column-footer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f0f2f5;
        }

        .column-footer a {
          color: #0079bf;
          text-decoration: none;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .column-footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          main {
            padding: 1rem;
          }

          .header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
            margin-bottom: 1.5rem;
          }

          .board {
            gap: 1rem;
          }
        }
      `}</style>

      <main>
        <header className="header">
          <h1>Taskboard</h1>
          <div className="header-actions">
            <Link href="/projects/new" className="new-project-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Project
            </Link>
            <button 
              onClick={() => signOut()} 
              className="signout-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </header>

        {projects.length === 0 ? (
          <p style={{ color: 'white', textAlign: 'center' }}>No projects available.</p>
        ) :
          <div className="board">
            {projects.map((project) => (
              <section key={project.id} className="column">
                <div className="column-header">{project.name}</div>
                <div className="column-desc">{project.description}</div>
                <ul className="tasks-list">
                  {project.tasks.length === 0 ? (
                    <li style={{ color: '#8993a4', fontStyle: 'italic', padding: '8px 12px' }}>
                      No tasks available
                    </li>
                  ) : (
                    project.tasks.map((task) => (
                      <li
                        key={task.id}
                        className={`task ${task.isCompleted ? 'done' : ''}`}
                        onClick={() => toggleTaskStatus(task.id, project.id)}
                      >
                        <span className="task-checkbox" />
                        <span>{task.title}</span>
                      </li>
                    ))
                  )}
                </ul>
                <footer className="column-footer">
                  <Link href={`/projects/${project.id}/tasks/new`}>
                    <span>➕</span> New task
                  </Link>
                </footer>
              </section>
            ))}
          </div>
        }
      </main>
    </>
  )
}
