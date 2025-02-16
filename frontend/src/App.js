import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, CssBaseline, Box } from '@mui/material';
import Login from './components/Login';
import Interview from './components/Interview';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [session, setSession] = useState(null);

  const handleLogin = (sessionData) => {
    console.log('Setting session:', sessionData);
    setSession(sessionData);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ pt: 4, minHeight: '100vh' }}>
          {!session ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Interview session={session} />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
