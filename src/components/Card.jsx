import React from 'react';
import { Card } from '@mui/material';
import styled from '@emotion/styled';

const EntryCard = styled(Card)({
  height: '250px',
  width: '400px',
  textAlign: 'center',
  overflow: 'hidden',
  ':hover': {
    cursor: 'pointer',
  },
});

const CardMUI = (props) => {
  return (
    <EntryCard
      id={props.id}
      variant={props.variant}
      onClick={props.onClick}
      style={props.style}
      dangerouslySetInnerHTML={{ __html: props.innerHTML }} // TODO: santize this later
    ></EntryCard>
  );
};

export { CardMUI as Card };
