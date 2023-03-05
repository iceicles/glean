import React from 'react';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import styled from '@emotion/styled';
import { Button } from './Button';

const FormTextField = styled(TextField)({
  width: '20rem',
});

const AuthFormMUI = (props) => {
  return (
    <>
      <Main>
        <h1>{props.isLogIn ? 'Log In' : 'Sign Up'}</h1>
        <Controller
          control={props.control}
          name='email'
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormTextField
              type='email'
              label='Email'
              variant='standard'
              helperText={error ? error.message : null}
              value={value}
              onChange={onChange}
            />
          )}
        />
        <Controller
          control={props.control}
          name='password'
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormTextField
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
            name='passwordConfirm'
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormTextField
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
        <Button
          disabled={props.loading}
          onClick={props.onSubmit}
          variant={'contained'}
        >
          {props.isLogIn ? 'Login' : 'Create Account'}
        </Button>
      </Main>
    </>
  );
};

/* --- STYLES --- */
const Main = styled('div')({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '2rem',
});

export { AuthFormMUI as AuthForm };
