import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const Nav = styled('nav')({
  textAlign: 'end',
  margin: '0.9rem',
});

const LoginLink = styled(Link)({
  display: 'inline-block',
  borderRadius: '0.25rem',
  padding: '0.9rem',
  width: 'fit-content',
  textDecoration: 'none',
  backgroundColor: 'green',
});

const Welcome = () => {
  return (
    <>
      <Nav>
        <LoginLink to='/auth?mode=login'>Get Access</LoginLink>
      </Nav>
      <h1>Welcome to Glean</h1>
    </>
  );
};

export default Welcome;
