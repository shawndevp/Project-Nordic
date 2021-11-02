import * as React from 'react';
import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import server from "../Global/config";

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://nordicbet.se/rights">
          Nordic Bet
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

const theme = createTheme();
const instance = axios.create({baseURL: server});

export default function ResetPassword() {
  const history = useHistory()
  const [jwt, setJwt] = useState();
  const [error, setError] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
console.log(data.get("identifier"))
    instance.post('/auth/reset-password', {
        code: 'privateCode', // code contained in the reset link of step 3.
        password: 'userNewPassword',
        passwordConfirmation: 'userNewPassword',
      })
      .then(response => {
        console.log("Your user's password has been reset.");
      })
      .catch(error => {
        console.log('An error occurred:', error.response);
      });
    
      
    

};

  

function showError(e) {
    setError(true)
}

  useEffect( ()=>{
    const JWT = localStorage.getItem("jwt")
    setJwt(JWT);
},[])



  return (
      <>
      {jwt ? <div>token {jwt}</div>:
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/Z0KjmjxUsKs)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ mb: 3}} >
               Insert code and so on
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1}}>
            <Grid container spacing={2}>
            <Grid  >
            <TextField
                margin="normal"
                required
                fullWidth
                id="identifier"
                label="Email Adress"
                name="identifier"
                autoComplete="email"
                autoFocus
              />
              </Grid>
              </Grid>

              <br/>{error ? (<Alert sx={{marginTop: 2, width: '100%'}}severity="error">Fel Email eller lösenord.</Alert>) : (<></>)}
             
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Request password
              </Button>
              <Grid container>
                <Grid item xs>
                  
                </Grid>
                <Grid item>
                  <Link href="/SignIn" variant="body2">
                    {"Suddenly remember your password? Click here!"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>}
    </>
  );
}