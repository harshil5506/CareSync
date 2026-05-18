import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await login(email, password);
      toast.success('Login successful!');
      setTimeout(() => navigate('/dashboard'), 500);
    } catch (err) {
      const errorMsg = err?.message || err?.data?.message || 'Login failed';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white dark:bg-card rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">CareSync</h1>
        <p className="text-center text-muted-foreground mb-8">Patient Management System</p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-center text-muted-foreground mb-3">📝 Test Credentials (Run: npm run seed)</p>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>👨‍💼 Admin: admin@caresync.com / Admin@123</p>
            <p>👨‍⚕️ Doctor: doctor1@caresync.com / Doctor@123</p>
            <p>👤 Patient: patient1@caresync.com / Patient@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
