'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: 'demo@example.com',
        password: 'demo123',
        redirect: false,
      });

      if (result?.error) {
        setError('Error accessing demo account');
        return;
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <style jsx>{`
        main {
          background: linear-gradient(135deg, #0079bf 0%, #005fa3 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          font-family: 'Segoe UI', system-ui, sans-serif;
        }

        .form-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo {
          width: 48px;
          height: 48px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #0079bf 0%, #005fa3 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
          font-weight: bold;
          box-shadow: 0 4px 12px rgba(0,121,191,0.2);
        }

        h1 {
          text-align: center;
          color: #172b4d;
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          color: #42526E;
          font-size: 0.9rem;
          font-weight: 500;
        }

        input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #DFE1E6;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #FAFBFC;
        }

        input:hover {
          background: white;
          border-color: #C1C7D0;
        }

        input:focus {
          outline: none;
          border-color: #4C9AFF;
          background: white;
          box-shadow: 0 0 0 2px rgba(76,154,255,0.2);
        }

        .error {
          background: #FFEBE6;
          border: 1px solid #FF5630;
          color: #DE350B;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        button {
          width: 100%;
          padding: 0.85rem;
          background: linear-gradient(135deg, #0079bf 0%, #005fa3 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }

        button:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,121,191,0.2);
        }

        button:not(:disabled):active {
          transform: translateY(0);
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.6s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          margin: 1.5rem 0;
          display: flex;
          align-items: center;
          text-align: center;
          color: #6B778C;
          font-size: 0.9rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid #DFE1E6;
        }

        .divider span {
          margin: 0 10px;
        }

        .demo-button {
          background: white;
          color: #0079bf;
          border: 2px solid #0079bf;
          margin-top: 1rem;
        }

        .demo-button:hover {
          background: #F4F5F7;
        }

        .register-text {
          text-align: center;
          margin-top: 1.5rem;
          color: #42526E;
          font-size: 0.9rem;
        }

        .register-link {
          color: #0079bf;
          text-decoration: none;
          font-weight: 500;
          margin-left: 0.25rem;
        }

        .register-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 640px) {
          .form-container {
            padding: 2rem;
            margin: 1rem;
          }

          h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="form-container">
        <div className="logo">T</div>
        <h1>Sign in to TaskBoard</h1>
        
        {error && (
          <div className="error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="loading-spinner" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="divider">
          <span>or</span>
        </div>

        <button 
          onClick={handleDemoLogin} 
          className="demo-button"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="loading-spinner" />
              Accessing demo...
            </>
          ) : (
            'Try Demo Account'
          )}
        </button>

        <div className="register-text">
          Don't have an account?
          <Link href="/auth/register" className="register-link">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
} 