import React from 'react';
import { TextField, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { Controller } from 'react-hook-form';

const AuthFormMUI = (props) => {
  return (
    <>
      <h1>{props.isLogIn ? 'Log In' : 'Sign Up'}</h1>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': {
            margin: '1rem',
            width: '20rem',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        noValidate
        autoComplete='off'
      >
        {!props.isLogIn && (
          <Controller
            control={props.control}
            name='username'
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                type='username'
                label='Username'
                variant='standard'
                helperText={error ? error.message : null}
                value={value}
                onChange={onChange}
              />
            )}
          />
        )}

        <Controller
          control={props.control}
          name='email'
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <>
              <TextField
                type='email'
                label='Email'
                variant='standard'
                helperText={error ? error.message : null}
                value={value}
                onChange={onChange}
              />
              {console.log('value - ', value)}
            </>
          )}
        />

        <Controller
          control={props.control}
          name='password'
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <TextField
              type='password'
              label='Password'
              variant='standard'
              helperText={error ? error.message : null}
              value={value}
              onChange={onChange}
            />
          )}
        />

        {!props.isLogIn && (
          <Controller
            control={props.control}
            name='reEnterPassword'
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                type='password'
                label='Re-Enter Password'
                variant='standard'
                helperText={error ? error.message : null}
                value={value}
                onChange={onChange}
              />
            )}
          />
        )}
      </Box>
      <p>
        {props.isLogIn
          ? "Don't have an account yet? "
          : 'Already have an account? '}
        <Link
          to={`?mode=${props.isLogIn ? 'signup' : 'login'}`}
          style={{
            color: 'white',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
        >
          {props.isLogIn ? 'Create one' : 'Sign In'}
        </Link>
      </p>
    </>
  );
};

export { AuthFormMUI as AuthForm };
