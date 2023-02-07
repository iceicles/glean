import React from 'react';
import { Button } from '@mui/material';

export const ButtonMUI = (props) => {
  return (
    <Button variant={props.variant} onClick={props.onClick}>
      {props.children}
    </Button>
  );
};
