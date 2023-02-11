import { Form } from '../components/Form';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';

const SignUpPage = () => {
  const handleSignUp = () => {
    console.log('Signing up...');
  };

  return (
    <>
      <h1>Awesome features await</h1>
      <div>
        <Link to='..'>Go Back</Link>
      </div>
      <Form showReEnterPassword={true} />
      <p>
        Have an account? <Link to='/signin'>Sign In</Link>
      </p>
      <Button variant={'outlined'} onClick={handleSignUp}>
        Get Started
      </Button>
    </>
  );
};

export default SignUpPage;
