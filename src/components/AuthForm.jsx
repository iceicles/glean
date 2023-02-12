import React, { useState } from 'react';
import { TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const AuthFormMUI = (prop) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const switchAuthHandler = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <>
      <h1>
        {isSignUp ? 'Awesome features await' : 'Sign in to access your library'}
      </h1>
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
        {isSignUp && (
          <TextField
            id='standard-password-input'
            label='Re-Enter Password'
            type='password'
            autoComplete='current-password'
            variant='standard'
          />
        )}
        <p>
          {isSignUp ? 'Have an account? ' : "Don't have an account yet? "}
          <Link
            style={{
              color: 'white',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
            onClick={switchAuthHandler}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Link>
        </p>
      </Box>
    </>
  );
};

export { AuthFormMUI as AuthForm };
