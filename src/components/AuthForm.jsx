import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Button } from './Button';

const AuthFormMUI = () => {
  const [isSignIn, setIsSignIn] = useState(true);

  const switchAuthHandler = () => {
    setIsSignIn(!isSignIn);
  };

  return (
    <>
      <h1>{isSignIn ? 'Log in' : 'Create account'}</h1>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { margin: '1rem', width: '50rem' },
        }}
        noValidate
        autoComplete='off'
      >
        <TextField
          id='standard-email-input'
          label='Email'
          type='email'
          autoComplete='current-email'
          variant='standard'
        />
        <TextField
          id='standard-password-input'
          label='Password'
          type='password'
          autoComplete='current-password'
          variant='standard'
        />
        {!isSignIn && (
          <TextField
            id='standard-password-input'
            label='Re-Enter Password'
            type='password'
            autoComplete='current-password'
            variant='standard'
          />
        )}
      </Box>
      <p>
        {isSignIn ? "Don't have an account yet? " : 'Already have an account? '}
        <Link
          style={{
            color: 'white',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          onClick={switchAuthHandler}
        >
          {isSignIn ? 'Create one' : 'Sign In'}
        </Link>
      </p>
      <Button variant={'outlined'}>
        {isSignIn ? 'Login' : 'Create Account'}
      </Button>
    </>
  );
};

export { AuthFormMUI as AuthForm };
