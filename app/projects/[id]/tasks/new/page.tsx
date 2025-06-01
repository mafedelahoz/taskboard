'use client';

import { useForm } from 'react-hook-form';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';


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
  const { status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchProject();
    }
  }, [status]);

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
      setError('Failed to create task. Please try again.');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="loading-container">
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  if (error || !project) {
    return (
      <div className="page-container">
        <div className="error-message">
          {error || 'Project not found'}
        </div>
        <Link href="/" className="back-button">
          <span className="back-icon"></span>
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="page-container">
      <div className="form-wrapper">
        <Link href="/" className="back-button">
          <span className="back-icon"></span>
          Back to Projects
        </Link>

        <div className="project-info">
          <span className="project-icon"></span>
          <span>Project: {project.name}</span>
        </div>

        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Create New Task</h1>
            <p className="form-subtitle">Add a task to your project board.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="form-content">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="title" className="form-label">
                Task Title *
              </label>
              <input
                id="title"
                type="text"
                {...register('title', { 
                  required: 'Task title is required',
                  maxLength: {
                    value: 100,
                    message: 'Title cannot exceed 100 characters'
                  }
                })}
                className="form-input"
                placeholder=""
              />
              {errors.title && (
                <div className="error-message">
                  {errors.title.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting ? (
                <>
                  <div className="loading-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                  </div>
                  Creating Task...
                </>
              ) : (
                <>
                  <span className="plus-icon"></span>
                  Create Task
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}