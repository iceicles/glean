import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from './Button';

const AuthFormMUI = () => {
  const [searchParams] = useSearchParams();
  const isLogIn = searchParams.get('mode') === 'login';

  return (
    <>
      <h1>{isLogIn ? 'Log In' : 'Create Account'}</h1>
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
        {!isLogIn && (
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
        {isLogIn ? "Don't have an account yet? " : 'Already have an account? '}
        <Link
          to={`?mode=${isLogIn ? 'signup' : 'login'}`}
          style={{
            color: 'white',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {isLogIn ? 'Create one' : 'Sign In'}
        </Link>
      </p>
      <Button variant={'outlined'}>
        {isLogIn ? 'Login' : 'Create Account'}
      </Button>
    </>
  );
};

export { AuthFormMUI as AuthForm };
