'use client';

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Task = {
  id: string
  title: string
  done: boolean
}

type Project = {
  id: string
  name: string
  description: string
  tasks: Task[]
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects', {
        cache: 'no-store',
      })
      const data = await res.json()
      setProjects(data)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskStatus = async (taskId: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
      })

      if (!res.ok) {
        throw new Error('Failed to update task')
      }

      // Refresh projects to show updated task status
      fetchProjects()
    } catch (error) {
      console.error('Error updating task:', error)
      alert('Failed to update task status')
    }
  }

  if (loading) {
    return (
      <main style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
        Loading...
      </main>
    )
  }

  return (
    <>
      <style>{`
        /* Reset y base */
        body,html,#__next {
          margin:0; padding:0; height:100%;
          font-family: 'Arial', sans-serif;
          background-color: #0079bf; /* Fondo azul Trello */
          overflow-x: auto;
        }
        main {
          padding: 20px;
          max-width: 1200px;
          margin: auto;
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: white;
          margin-bottom: 20px;
        }
        .header h1 {
          font-weight: 700;
          font-size: 2.5rem;
        }
        .new-project-btn {
          background: #026aa7;
          color: white;
          padding: 10px 20px;
          border-radius: 3px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.2s ease;
          box-shadow: 0 2px 5px rgb(0 0 0 / 0.2);
        }
        .new-project-btn:hover {
          background: #055a8c;
        }

        /* Tablero de columnas */
        .board {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding-bottom: 20px;
        }

        /* Columna estilo Trello */
        .column {
          background: #ebecf0;
          border-radius: 3px;
          width: 272px; /* Ancho fijo Trello */
          display: flex;
          flex-direction: column;
          max-height: 80vh;
          box-shadow: 0 1px 0 rgb(9 30 66 / 25%);
        }

        .column-header {
          padding: 10px 12px;
          font-weight: 600;
          font-size: 1.2rem;
          color: #172b4d;
          user-select: none;
        }
        .column-desc {
          font-size: 0.875rem;
          padding: 0 12px 10px;
          color: #5e6c84;
          user-select: none;
        }

        /* Lista de tareas */
        .tasks-list {
          flex-grow: 1;
          overflow-y: auto;
          padding: 0 8px 8px;
          list-style: none;
          margin: 0;
        }
        .task {
          background: white;
          border-radius: 3px;
          box-shadow: 0 1px 0 rgb(9 30 66 / 25%);
          padding: 8px 12px;
          margin-bottom: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          color: #172b4d;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .task:hover {
          background-color: #f4f5f7;
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgb(9 30 66 / 25%);
        }
        .task.done {
          color: #a5adba;
          text-decoration: line-through;
        }
        .task-checkbox {
          width: 16px;
          height: 16px;
          border-radius: 3px;
          border: 2px solid #dfe1e6;
          display: inline-block;
          position: relative;
        }
        .task.done .task-checkbox {
          background: #0079bf;
          border-color: #0079bf;
        }
        .task.done .task-checkbox:after {
          content: '✓';
          color: white;
          position: absolute;
          top: -2px;
          left: 2px;
          font-size: 12px;
        }

        /* Footer con link */
        .column-footer {
          padding: 10px 12px;
          border-top: 1px solid #dfe1e6;
        }
        .column-footer a {
          font-size: 0.875rem;
          color: #0052cc;
          text-decoration: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .column-footer a:hover {
          text-decoration: underline;
        }

        /* Scroll bar para columnas */
        .board::-webkit-scrollbar {
          height: 8px;
        }
        .board::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.2);
          border-radius: 4px;
        }
      `}</style>

      <main>
        <header className="header">
          <h1>Taskboard</h1>
          <Link href="/projects/new" className="new-project-btn">
            + New Project
          </Link>
        </header>

        {projects.length === 0 ? (
          <p style={{ color: 'white', textAlign: 'center' }}>No hay proyectos disponibles.</p>
        ) : (
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
                        className={`task ${task.done ? 'done' : ''}`}
                        onClick={() => toggleTaskStatus(task.id)}
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
        )}
      </main>
    </>
  )
}
