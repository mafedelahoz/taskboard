'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'

type ProjectFormData = {
  name: string;
  description: string;
};

export default function NewProject() {
  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>()
  const router = useRouter()

  const onSubmit = async (data: ProjectFormData) => {
    await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    router.push('/')
  }

  return (
    <>
      <style>{`
        .form-container {
          max-width: 450px;
          margin: 3rem auto;
          background: #ffffff;
          padding: 2rem 2.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        h1 {
          margin-bottom: 1.5rem;
          font-size: 2rem;
          font-weight: 700;
          color: #172b4d;
          text-align: center;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #172b4d;
          font-size: 1rem;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 1rem;
          border: 1.5px solid #dfe1e6;
          border-radius: 4px;
          transition: border-color 0.3s ease;
          box-sizing: border-box;
          font-family: inherit;
          resize: vertical;
        }

        input[type="text"]:focus,
        textarea:focus {
          outline: none;
          border-color: #0079bf;
          box-shadow: 0 0 5px rgba(0, 121, 191, 0.5);
        }

        .error-message {
          color: #de350b;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        button {
          margin-top: 1.5rem;
          background-color: #0079bf;
          border: none;
          color: white;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.25s ease;
          user-select: none;
        }

        button:hover {
          background-color: #005a8c;
        }

        button:active {
          background-color: #004270;
        }
      `}</style>

      <main className="form-container" role="main">
        <h1>Create New Project</h1>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <label htmlFor="name">Project Name</label>
          <input
            id="name"
            type="text"
            placeholder="Enter project name"
            {...register('name', { required: true })}
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p role="alert" className="error-message">
              Project name is required
            </p>
          )}

          <label htmlFor="description" style={{ marginTop: '1.25rem' }}>Description</label>
          <textarea
            id="description"
            placeholder="Enter project description (optional)"
            rows={4}
            {...register('description')}
          />

          <button type="submit" aria-label="Create Project">Create Project</button>
        </form>
      </main>
    </>
  )
}
