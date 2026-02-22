import { useActionState, type ReactElement } from 'react';
import { AuthButton, AuthForm, AuthInput, ErrorAlert } from '../../components/pages/auth';
import { Link, useNavigate } from 'react-router-dom';
import type { ApiResponse, User } from '../../types';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';

type LoginState = {
  error: string;
};

export function Login(): ReactElement {
  const navigate = useNavigate();
  const { login } = useAuth();

  const loginAction = async (_prevState: LoginState, formData: FormData): Promise<LoginState> => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: '' };
    }

    try {
      const response: ApiResponse<User> = await authService.login(email, password);
      login(response.result);
      navigate('/dashboard');
      return { error: '' };
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return {
        error: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  };

  const [state, formAction, isPending] = useActionState(loginAction, {
    error: ''
  });

  return (
    <AuthForm title="Enter your Account" subtitle="Get start with secure tunneling">
      <ErrorAlert message={state.error} />

      <form action={formAction} className="space-y-6">
        <AuthInput
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          disabled={isPending}
          required
        />

        <AuthInput
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          disabled={isPending}
          required
        />

        <AuthButton loading={isPending} disabled={isPending} loadingText="Loggin in..." text="Login" />

        <div className="text-center">
          <p className="text-sm text-slate-400">
            Don't have an account?
            <Link to="/auth/register" className="text-tunnel-400 hover:text-tunnel-300 transition-colors ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </AuthForm>
  );
}
