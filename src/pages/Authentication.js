import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthForm } from '../components/AuthForm';
import { Button } from '../components/Button';
import { useAuth } from '../components/contexts/AuthContext';

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
    console.log(data.email);
    console.log(data.password);

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
        navigate('/diary');
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {error && <h1 style={{ color: 'red' }}>{error}</h1>}
        <AuthForm control={control} isLogIn={isLogIn} />
        <Button
          disabled={loading}
          onClick={handleSubmit(onSubmit)}
          variant={'contained'}
        >
          {isLogIn ? 'Login' : 'Create Account'}
        </Button>
      </div>
    </>
  );
};

export default AuthenticationPage;
