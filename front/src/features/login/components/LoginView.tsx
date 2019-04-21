import { Box, Grommet, Heading } from 'grommet';
import React from 'react';
import { useActions } from 'typeless';
import { LoginActions } from '../interface';
import SigninButton from './btn_google_signin.png';

export const LoginView = () => {
  const { auth } = useActions(LoginActions);
  return (
    <>
      <Grommet full>
        <Box justify="center" align="center" background="brand" fill>
          <Heading textAlign="center">Welcome to Bibliotheca</Heading>
          <input type="image" src={SigninButton} alt="signin with google" onClick={auth} />
        </Box>
      </Grommet>
    </>
  );
};
