import { useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthForm } from '../components/AuthForm';
import { Button } from '../components/Button';

const AuthenticationPage = () => {
  const [searchParams] = useSearchParams();
  const isLogIn = searchParams.get('mode') === 'login';
  const { control, handleSubmit } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      reEnterPassword: '',
    },
  });

  const onSubmit = (data) => {
    console.log(data);
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
        <AuthForm control={control} isLogIn={isLogIn} />
        <Button onClick={handleSubmit(onSubmit)} variant={'outlined'}>
          {isLogIn ? 'Login' : 'Create Account'}
        </Button>
      </div>
    </>
  );
};

export default AuthenticationPage;
