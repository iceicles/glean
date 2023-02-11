import React from 'react';
import { TextField, Box } from '@mui/material';

const FormMUI = (prop) => {

  return (
    <>
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
        {prop.showReEnterPassword && (
          <TextField
            id='standard-password-input'
            label='Re-Enter Password'
            type='password'
            autoComplete='current-password'
            variant='standard'
          />
        )}
      </Box>
    </>
  );
};

export { FormMUI as Form };
