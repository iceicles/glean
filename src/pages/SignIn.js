import { Link } from 'react-router-dom';
import { Form } from '../components/Form';
import { Button } from '../components/Button';

const SignInPage = () => {
  const handleSignIn = () => {
    console.log('Signing in...');
  };

  return (
    <>
      <h1>Sign in to access your library</h1>
      <div>
        <Link to='..'>Go Back</Link>
      </div>
      <Form />
      <p>
        Don't have an account yet? <Link to='/signup'>Sign Up</Link>
      </p>
      <Button variant={'outlined'} onClick={handleSignIn}>
        Sign In
      </Button>
    </>
  );
};

export default SignInPage;
