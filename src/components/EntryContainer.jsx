import React from 'react';
import styled from '@emotion/styled';

const EntryContainer = (props) => {
  return <Container>{props.children}</Container>;
};

/* --- STYLES --- */
const Container = styled('div')({
  height: '60vh',
  maxWidth: '75%',
  margin: '0 auto',
});

export default EntryContainer;
