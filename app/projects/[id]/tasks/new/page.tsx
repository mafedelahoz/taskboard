'use client';

import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';

type TaskFormData = {
  title: string;
};

export default function NewTask() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskFormData>();
  const router = useRouter();
  const params = useParams();

  const onSubmit = async (data: TaskFormData) => {
    const res = await fetch(`/api/projects/${params.id}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push(`/projects/${params.id}`);
    } else {
      alert('Error creating task');
    }
  };

  return (
    <main
      style={{
        maxWidth: '420px',
        width: '100%',
        margin: '3rem auto',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        padding: '2.5rem 2rem',
        boxSizing: 'border-box', 
      }}
    >
      <h1
        style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '2rem',
          color: '#222',
          letterSpacing: '-1px',
          textAlign: 'center',
        }}
      >
        Add New Task
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label
            htmlFor="title"
            style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: 500,
              color: '#444',
              fontSize: '1rem',
            }}
          >
            Task Title
          </label>
           <input
            id="title"
            type="text"
            placeholder="Enter task title"
            {...register('title', { required: true })}
            style={{
              width: '100%',
              padding: '0.85rem 1rem',
              borderRadius: '6px',
              border: errors.title ? '1.5px solid #e74c3c' : '1.5px solid #d1d5db',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border 0.2s',
              background: errors.title ? '#fff6f6' : '#fafbfc',
              boxSizing: 'border-box', 
            }}
            autoComplete="off"
          />
          {errors.title && (
            <span style={{ color: '#e74c3c', fontSize: '0.95rem', marginTop: '0.25rem', display: 'block' }}>
              The title is mandatory
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            background: 'linear-gradient(90deg, #0079bf 0%, #005fa3 100%)',
            color: '#fff',
            padding: '0.95rem 0',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '1.1rem',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'background 0.2s',
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </main>
  );
}