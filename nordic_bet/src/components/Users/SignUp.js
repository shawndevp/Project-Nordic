import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import server from "../Global/config";
import { useHistory } from "react-router-dom";


//function for putting copyright sign
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://nordicbet.se/rights">
        Nordic Bet
      </Link>
      {new Date().getFullYear()}
    </Typography>
  );
}

const theme = createTheme();
const instance = axios.create({ baseURL: server });

//function for registering a user 
export default function SignUp() {
  const history = useHistory();
  const [error, setError] = useState(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    instance
      .post(`auth/local/register`, {
        fname: data.get("förnamn"),
        lname: data.get("efternamn"),
        username: data.get("användarnamn"),
        adress: data.get("adress"),
        city: data.get("stad"),
        zipcode: data.get("postnr"),
        country: data.get("land"),
        email: data.get("email"),
        password: data.get("password"),
      })
      .then((response) => {
        history.push("/SignIn");
      })
      .catch(showError);
  };

  function showError(e) {
    setError(true);
  }
//function for letting the user see or hide their password
  const [visibility, setVisibility] = useState(false)
  function handleToggle() {
    
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      setVisibility(true)
    } else {
      x.type = "password";
      setVisibility(false)
    }
  }

  //visuals for the regestration page
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "primary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Registrera Konto
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="förnamn"
                  required
                  fullWidth
                  id="fname"
                  label="Förnamn"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lname"
                  label="Efternamn"
                  name="efternamn"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Användarnamn"
                  name="användarnamn"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="adress"
                  label="Adress"
                  name="adress"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="Stad"
                  name="stad"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="zipcode"
                  label="Postnummer"
                  type="number"
                  name="postnr"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="country"
                  label="Land"
                  name="land"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Adress"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Lösenord"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
                {!  visibility ?  <i style={{cursor:'pointer'}} className="bi bi-eye-slash" onClick={handleToggle}> Visa lösenord</i>
              :
              <i  style={{cursor:'pointer'}}className="bi bi-eye" onClick={handleToggle}> Dölj lösenord</i>
              }
              </Grid>

              <br />
              {error ? (
                <Alert
                  sx={{ marginTop: 2, marginLeft: 2, width: "100%" }}
                  severity="error"
                >
                  Uppgifter redan använda, använd annat.
                </Alert>
              ) : (
                <></>
              )}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="Jag vill ta emot nyhetsbrev och uppdateringar via email."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Registrera
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/SignIn" variant="body2">
                  Har du redan ett konto? Logga in här
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
