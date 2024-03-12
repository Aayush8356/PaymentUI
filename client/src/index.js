import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './store/auth';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import ColorModeSwitcher from './ColorModeSwitcher';

const root = ReactDOM.createRoot(document.getElementById('root'));
const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
};
const theme = extendTheme({ colors });
root.render(
  <AuthProvider>
    <ChakraProvider theme={theme}>
      <App />
      <ColorModeSwitcher />
    </ChakraProvider>
  </AuthProvider>
);
