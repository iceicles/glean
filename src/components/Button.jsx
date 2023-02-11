import React from 'react';
import { Button } from '@mui/material';

const ButtonMUI = (props) => {
  return (
    <Button variant={props.variant} onClick={props.onClick}>
      {props.children}
    </Button>
  );
};

export {ButtonMUI as Button}
