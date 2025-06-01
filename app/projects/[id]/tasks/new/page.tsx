'use client';

import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type TaskFormData = {
  title: string;
};

type Project = {
  id: string;
  name: string;
};

export default function NewTask() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskFormData>();
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        if (!id) throw new Error('Project ID not found');

        const res = await fetch(`/api/projects/${decodeURIComponent(id)}`);
        if (!res.ok) throw new Error('Failed to fetch project');

        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  const onSubmit = async (data: TaskFormData) => {
    try {
      const id = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!id) {
        throw new Error('Project ID not found');
      }

      const res = await fetch(`/api/projects/${decodeURIComponent(id)}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Failed to create task');
      }

      router.push('/');
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Please try again.');
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#fff'
      }}>
        <p>{error || 'Project not found'}</p>
        <Link href="/" style={{
          color: '#fff',
          textDecoration: 'underline',
          marginTop: '1rem',
          display: 'inline-block'
        }}>
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <main
      style={{
        maxWidth: '420px',
        width: '100%',
        margin: '3rem auto',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        padding: '2.5rem 2rem',
        boxSizing: 'border-box', 
      }}
    >
      <style>{`
        .header {
          display: flex;
          align-items: center;
          margin-bottom: 2rem;
          position: relative;
        }

        .back-button {
          position: absolute;
          left: 0;
          color: #42526E;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.9rem;
          padding: 4px 8px;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .back-button:hover {
          background: #F4F5F7;
        }

        h1 {
          flex: 1;
          font-size: 1.75rem;
          font-weight: 700;
          color: #172b4d;
          text-align: center;
          margin: 0;
        }

        .project-name {
          text-align: center;
          color: #6B778C;
          font-size: 0.9rem;
          margin-top: -0.5rem;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #172b4d;
          font-size: 0.95rem;
        }

        input[type="text"] {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 2px solid #dfe1e6;
          border-radius: 6px;
          transition: all 0.2s ease;
          box-sizing: border-box;
          font-family: inherit;
          background: #FAFBFC;
        }

        input[type="text"]:hover {
          background: #FFFFFF;
          border-color: #C1C7D0;
        }

        input[type="text"]:focus {
          outline: none;
          border-color: #4C9AFF;
          background: #FFFFFF;
          box-shadow: 0 0 0 2px rgba(76, 154, 255, 0.2);
        }

        .error-message {
          color: #DE350B;
          font-size: 0.85rem;
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        button {
          margin-top: 2rem;
          background: linear-gradient(to bottom, #0052CC, #0747A6);
          border: none;
          color: white;
          padding: 0.85rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          width: 100%;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        button:not(:disabled):hover {
          background: linear-gradient(to bottom, #0747A6, #043594);
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        button:not(:disabled):active {
          transform: translateY(0);
          box-shadow: none;
        }

        button:disabled {
          background: #091E420F;
          cursor: not-allowed;
          color: #A5ADBA;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid #ffffff;
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="header">
        <Link href="/" className="back-button">
          ← Back
        </Link>
        <h1>Add Task</h1>
      </div>

      <div className="project-name">
        to project: {project.name}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="title">Task Title *</label>
          <input
            id="title"
            type="text"
            placeholder=""
            {...register('title', { 
              required: 'Task title is required',
              maxLength: {
                value: 100,
                message: 'Title cannot exceed 100 characters'
              }
            })}
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="error-message">
              ⚠️ {errors.title.message}
            </p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          aria-label={isSubmitting ? "Creating Task..." : "Create Task"}
        >
          {isSubmitting ? (
            <>
              <span className="loading-spinner"></span>
              Creating...
            </>
          ) : (
            'Create Task'
          )}
        </button>
      </form>
    </main>
  );
}