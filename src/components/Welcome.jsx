import React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';
import { fontSize } from '@mui/system';

const Section = styled('section')({
  display: 'flex',
  textAlign: 'end',
  margin: '0.9rem',
  gap: '2rem',
});

const Main = styled('main')({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const LoginLink = styled(Link)({
  display: 'inline-block',
  borderRadius: '0.25rem',
  padding: '0.9rem',
  width: 'fit-content',
  textDecoration: 'none',
  backgroundColor: 'green',
});

const MainGreeting = styled('h1')({
  fontSize: '8rem',
});

const Welcome = () => {
  return (
    <>
      <Main>
        <MainGreeting>Welcome to Glean</MainGreeting>
        <h2>
          Create an account for a personalized experienced or continue as guest
          to try it out!
        </h2>
        <Section>
          <LoginLink to='/auth?mode=login'>Get Access</LoginLink>
          <LoginLink to='/diary'>Guest</LoginLink>
        </Section>
      </Main>
    </>
  );
};

export default Welcome;
