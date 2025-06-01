'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type ProjectFormData = {
  name: string;
  description: string;
};

export default function NewProject() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectFormData>()
  const router = useRouter()

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) {
        throw new Error('Failed to create project');
      }

      router.push('/');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    }
  }

  return (
    <>
      <style>{`
        .form-container {
          max-width: 450px;
          margin: 3rem auto;
          background: #ffffff;
          padding: 2rem 2.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

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

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          border: 2px solid #dfe1e6;
          border-radius: 6px;
          transition: all 0.2s ease;
          box-sizing: border-box;
          font-family: inherit;
          resize: vertical;
          background: #FAFBFC;
        }

        input[type="text"]:hover,
        textarea:hover {
          background: #FFFFFF;
          border-color: #C1C7D0;
        }

        input[type="text"]:focus,
        textarea:focus {
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

        .character-count {
          font-size: 0.8rem;
          color: #6B778C;
          text-align: right;
          margin-top: 0.25rem;
        }
      `}</style>

      <main className="form-container" role="main">
        <div className="header">
          <Link href="/" className="back-button">
            ← Back
          </Link>
          <h1>Create Project</h1>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="form-group">
            <label htmlFor="name">Project Name *</label>
            <input
              id="name"
              type="text"
              placeholder=""
              {...register('name', { 
                required: 'Project name is required',
                maxLength: {
                  value: 50,
                  message: 'Project name cannot exceed 50 characters'
                }
              })}
              aria-invalid={errors.name ? "true" : "false"}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p role="alert" className="error-message">
                ⚠️ {errors.name.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              placeholder="Describe your project (optional)"
              rows={4}
              {...register('description', {
                maxLength: {
                  value: 200,
                  message: 'Description cannot exceed 200 characters'
                }
              })}
              disabled={isSubmitting}
            />
            {errors.description && (
              <p role="alert" className="error-message">
                ⚠️ {errors.description.message}
              </p>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            aria-label={isSubmitting ? "Creating Project..." : "Create Project"}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Creating...
              </>
            ) : (
              'Create Project'
            )}
          </button>
        </form>
      </main>
    </>
  )
}
