import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../contexts/AuthContext';

const AuthenticationPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const isLogIn = searchParams.get('mode') === 'login';
  const navigate = useNavigate();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const { signup, login } = useAuth();

  const onSubmit = async (data) => {
    if (!isLogIn && data.password !== data.passwordConfirm) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      setLoading(true);
      if (isLogIn) {
        await login(data.email, data.password);
        navigate('/diary');
      } else {
        await signup(data.email, data.password);
        navigate('/auth?mode=login');
      }
    } catch {
      if (isLogIn) {
        setError('Failed to sign in');
      } else {
        setError('Failed to create an account');
      }
    }
    setLoading(false);
  };

  return (
    <>
      {error && <h1 style={{ color: 'red' }}>{error}</h1>}
      <AuthForm
        control={control}
        isLogIn={isLogIn}
        onSubmit={handleSubmit(onSubmit)}
        loading={loading}
      />
    </>
  );
};

export default AuthenticationPage;
