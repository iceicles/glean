import React from 'react';
import { Card, Box } from '@mui/material';

const CardMUI = (props) => {
  return (
    <Box
      sx={{
        width: 'fit-content',
        height: 'fit-content',
        //maxHeight: 200,
        overflow: 'hidden',
        textAlign: 'center',
        marginRight: 15,
        '&:hover': {
          cursor: 'pointer',
        },
      }}
    >
      <Card
        id={props.id}
        variant={props.variant}
        onClick={props.onClick}
        dangerouslySetInnerHTML={{ __html: props.innerHTML }} // TODO: santize this later
      >
        {props.children}
      </Card>
    </Box>
  );
};

export {CardMUI as Card}