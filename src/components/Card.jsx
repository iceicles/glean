import React from 'react';
import { Card } from '@mui/material';
import styled from '@emotion/styled';

const CardMUI = (props) => {
  return (
    <EntryCard
      id={props.id}
      variant={props.variant}
      onClick={props.onClick}
      style={props.style}
      dangerouslySetInnerHTML={{ __html: props.innerHTML }}
    ></EntryCard>
  );
};

/* --- STYLES --- */
const EntryCard = styled(Card)({
  height: '250px',
  width: 'calc(100% / 2.041)',
  flexGrow: '1',
  textAlign: 'center',
  ':hover': {
    cursor: 'pointer',
  },
});

export { CardMUI as Card };
