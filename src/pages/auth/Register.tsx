import { useActionState, type ReactElement } from 'react';
import { AuthButton, AuthForm, AuthInput, ErrorAlert } from '../../components/pages/auth';
import { Link, useNavigate } from 'react-router-dom';
import type { ApiResponse, User } from '../../types';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../hooks/useAuth';

type RegisterState = {
  error: string;
};

export function Register(): ReactElement {
  const navigate = useNavigate();
  const { login } = useAuth();

  const registerAction = async (_prevState: RegisterState, formData: FormData): Promise<RegisterState> => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: '' };
    }

    try {
      const response: ApiResponse<User> = await authService.register(email, password);
      login(response.result);
      navigate('/dashboard');
      return { error: '' };
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      return {
        error: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  };

  const [state, formAction, isPending] = useActionState(registerAction, {
    error: ''
  });

  return (
    <AuthForm title="Create Account" subtitle="Get start with secure tunneling">
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

        <AuthButton loading={isPending} disabled={isPending} loadingText="Creating Account..." text="Register" />

        <div className="text-center">
          <p className="text-sm text-slate-400">
            Already have an account?
            <Link to="/auth/login" className="text-tunnel-400 hover:text-tunnel-300 transition-colors ml-1">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthForm>
  );
}
