import React, { useState, useEffect } from "react";
import axios from "axios";
import server from "../Global/config";
import Flags from "country-flag-icons/react/3x2";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "bootstrap/dist/css/bootstrap.min.css";
import setTeamFlag from "./Flags";

function Game({
  event_id,
  eid_xml,
  eventname,
  grp,
  odds_1,
  odds_x,
  odds_2,
  status,
  home,
  away,
  deadline
})
//Hämta Props från Game.js
{
  const instance = axios.create({ baseURL: server });
  const playingTeams = eventname.split("-");
  let home_team = playingTeams[0];
  let away_team = playingTeams[1];
  if(home !== "" && home !== null){
    home_team = home
  }
  if (away !== "" && away !== null){
    away_team = away
  }
 //Definera och hämta hemma och bortalag

  const [gameId, setGameId] = useState();
  const user_id = localStorage.getItem("user_id");
  
  const [homeFlag, setHomeFlag] = useState("AQ");
  const [awayFlag, setAwayFlag] = useState("AQ");
  const [loading, setLoading] = useState(true);
  const [hasBetted, setHasBetted] = useState(false);

  
  const dateArray = deadline.split("T")
  const date = dateArray[0]
  const timeArray = dateArray[1].split(":")
  const time = timeArray[0] + ":" + timeArray[1]

  //Split för att ta bort specifika tecken i date och time från DB
  useEffect(() => {
    const fetchGameId = async () => {
      const response = await instance.get(`Euro_events?eid_xml=${event_id}`);
      setGameId(response.data[0].id);
      setLoading(false)
    };
    fetchGameId();
    
    
    setHomeFlag(setTeamFlag("home", home_team));
    setAwayFlag(setTeamFlag("away", away_team));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!loading){
    const fetchBetOnGame = async () => {
    
      const response = await instance.get(`Bets?user=${user_id}&&euro_event=${gameId}`)
      if(response.data.length > 0){
        setHasBetted(true)
      }
     
    }
    fetchBetOnGame()
  }
// Fetchar varje spel på en match

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  }));
 // Expand MUI 
  const initialValues = {
    typeOfBet: "",
    homeTeamGoals: "",
    awayTeamGoals: "",
    winner: "",
  };

  // Initiala värden som är "null" först sedan ska följas med vad man skriver. 

  const [formValues, setFormValues] = useState(initialValues);

  function handleOnSubmit() {
    
    if (formValues.typeOfBet === "BetOnResult") {
      
     
      instance
        .post(`bets`, {
          type: formValues.typeOfBet,
          homeTeamGoals: formValues.homeTeamGoals,
          awayTeamGoals: formValues.awayTeamGoals,
          winner: formValues.winner,
          euro_event: gameId,
          user: user_id,
         

        })
        .then();
      window.location.reload();
    } 
    // Submit knapp som postar värden man har fyllt in till Strapi

    else if (formValues.typeOfBet === "BetOnGoals") {
      instance
        .post(`bets`, {
          type: formValues.typeOfBet,
          homeTeamGoals: formValues.homeTeamGoals,
          awayTeamGoals: formValues.awayTeamGoals,
          winner: "Not included in this bet",
          euro_event: gameId,
          user: user_id,
         
        })
        .then();
      window.location.reload();
    } else if (formValues.typeOfBet === "BetOnWinner") {
      instance
        .post(`bets`, {
          type: formValues.typeOfBet,
          homeTeamGoals: "Not included in this bet",
          awayTeamGoals: "Not included in this bet",
          winner: formValues.winner,
          euro_event: gameId,
          user: user_id,
         

        })
        .then();
      window.location.reload();
    } else {
      console.log("empty fields");
    }
  }

  // Samma submit knapp fast beroende på vad för spel man lägger.

  function handleOnChange(e) {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  // hantering beroende på änding

  const HomeFlag = Flags[homeFlag];
  const AwayFlag = Flags[awayFlag];
  // Konstatera flaggor
  return (
    <>
      <div className="mb-3">
        <br />
        <br />
        <Card
          className="bg-light opacity-70"
          container="true"
          spacing={6}
          sx={{ maxWidth: "100%", mx: "auto", width: ["50%", "50%", "25%"] }}
        >
          <CardContent></CardContent>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: 20 }}
          >
            <strong>{grp} </strong><br/>
            {date}
            <br/>
            {time}
            <br/>
            <span> </span>
            <HomeFlag  style={{border:"1px solid"}} width="40px" title="HomeFlag" className="..." />
            <span> </span>
            {home_team}
                <span> - </span>
            {away_team}
            <span> </span>
            <AwayFlag style={{border:"1px solid"}} width="40px" title="AwayFlag" className="..." />
            <span> </span>
            
          </Typography>

          <CardActions
            disableSpacing
            sx={{ display: "inline-flex", verticalAlign: "middle" }}
          > 
          { status === "Not Started" && hasBetted === false? 

            <ExpandMore
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon></ExpandMoreIcon>
            </ExpandMore>
            : status === "Not Ready" ?
          <Typography paragraph>Vänta på att lag ska tilldelas!</Typography>:
          <Typography paragraph>Du har ett bet på detta spel! </Typography> }
          </CardActions>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <form onSubmit={handleOnSubmit}>
                <div>
                  <div>
                    <span>Typ av spel</span>
                    <br />
                    <FormControl sx={{ m: 1, minWidth: 100 }}>
                      <Select
                        name="typeOfBet"
                        id="type"
                        value={formValues.typeOfBet}
                        onChange={handleOnChange}
                        sx={{
                          minWidth: 125,
                          minHeight: 5,
                        }}
                      >
                        <MenuItem value="BetOnResult"> Spela på resultat </MenuItem>
                        <MenuItem value="BetOnGoals"> Spela på mål </MenuItem>
                        <MenuItem value="BetOnWinner"> Spela på 1X2 </MenuItem>
                      </Select>
                      <br />
                      {formValues.typeOfBet === "BetOnResult" ? (
                        <>
                          <span>{home_team} Antal Mål</span>
                          <Select
                            required
                            name="homeTeamGoals"
                            id="homeTeamGoals"
                            value={formValues.homeTeamGoals}
                            onChange={handleOnChange}
                            sx={{
                              mx: 5,
                              minWidth: 125,
                              minHeight: 5,
                            }}
                          >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="0"> 0 </MenuItem>
                            <MenuItem value="1"> 1 </MenuItem>
                            <MenuItem value="2"> 2 </MenuItem>
                            <MenuItem value="3"> 3 </MenuItem>
                            <MenuItem value="4"> 4 </MenuItem>
                            <MenuItem value="5"> 5 </MenuItem>
                            <MenuItem value="6"> 6 </MenuItem>
                            <MenuItem value="7"> 7 </MenuItem>
                            <MenuItem value="8"> 8 </MenuItem>
                          </Select>
                          <br />
                          <span>{away_team} Antal Mål</span>
                          <Select
                            required
                            name="awayTeamGoals"
                            id="awayTeamGoals"
                            value={formValues.awayTeamGoals}
                            onChange={handleOnChange}
                            sx={{
                              mx: 5,
                              minWidth: 125,
                              minHeight: 5,
                            }}
                          >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="0"> 0 </MenuItem>
                            <MenuItem value="1"> 1 </MenuItem>
                            <MenuItem value="2"> 2 </MenuItem>
                            <MenuItem value="3"> 3 </MenuItem>
                            <MenuItem value="4"> 4 </MenuItem>
                            <MenuItem value="5"> 5 </MenuItem>
                            <MenuItem value="6"> 6 </MenuItem>
                            <MenuItem value="7"> 7 </MenuItem>
                            <MenuItem value="8"> 8 </MenuItem>
                          </Select>
                          <br />
                          <span>Vinnare</span>
                          <Select
                            required
                            name="winner"
                            id="winner"
                            value={formValues.winner}
                            onChange={handleOnChange}
                            sx={{
                              mx: 5,
                              minWidth: 125,
                              minHeight: 5,
                            }}
                          >
                            <MenuItem value=""></MenuItem>
                            {formValues.homeTeamGoals>formValues.awayTeamGoals ?
                            <MenuItem value={home_team}> {home_team} </MenuItem>
                            : formValues.awayTeamGoals>formValues.homeTeamGoals ? 
                            <MenuItem value={away_team}> {away_team} </MenuItem> :
                            <MenuItem value="X">X</MenuItem>
                            }
                          </Select>
                          <br />
                        </>
                      ) : (
                        <></>
                      )}
                      {formValues.typeOfBet === "BetOnGoals" ? (
                        <>
                          <span>{home_team} Antal Mål</span>
                          <Select
                            required
                            name="homeTeamGoals"
                            id="homeTeamGoals"
                            value={formValues.homeTeamGoals}
                            onChange={handleOnChange}
                            sx={{
                              mx: 5,
                              minWidth: 125,
                              minHeight: 5,
                            }}
                          >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="0"> 0 </MenuItem>
                            <MenuItem value="1"> 1 </MenuItem>
                            <MenuItem value="2"> 2 </MenuItem>
                            <MenuItem value="3"> 3 </MenuItem>
                            <MenuItem value="4"> 4 </MenuItem>
                            <MenuItem value="5"> 5 </MenuItem>
                            <MenuItem value="6"> 6 </MenuItem>
                            <MenuItem value="7"> 7 </MenuItem>
                            <MenuItem value="8"> 8 </MenuItem>
                          </Select>
                          <br />

                          <span>{away_team} Antal Mål</span>
                          <Select
                            required
                            name="awayTeamGoals"
                            id="awayTeamGoals"
                            value={formValues.awayTeamGoals}
                            onChange={handleOnChange}
                            sx={{
                              mx: 5,
                              minWidth: 125,
                              minHeight: 5,
                            }}
                          >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value="0"> 0 </MenuItem>
                            <MenuItem value="1"> 1 </MenuItem>
                            <MenuItem value="2"> 2 </MenuItem>
                            <MenuItem value="3"> 3 </MenuItem>
                            <MenuItem value="4"> 4 </MenuItem>
                            <MenuItem value="5"> 5 </MenuItem>
                            <MenuItem value="6"> 6 </MenuItem>
                            <MenuItem value="7"> 7 </MenuItem>
                            <MenuItem value="8"> 8 </MenuItem>
                          </Select>
                          <br />
                        </>
                      ) : (
                        <></>
                      )}
                      {formValues.typeOfBet === "BetOnWinner" ? (
                        <>
                          <span>Vinnare</span>
                          <Select
                            required
                            name="winner"
                            id="winner"
                            value={formValues.winner}
                            onChange={handleOnChange}
                            sx={{
                              mx: 5,
                              minWidth: 125,
                              minHeight: 5,
                            }}
                          >
                            <MenuItem value=""></MenuItem>
                            <MenuItem value={home_team}> {home_team} </MenuItem>
                            <MenuItem value="X">X</MenuItem>
                            <MenuItem value={away_team}> {away_team} </MenuItem>
                          </Select>
                          <br />
                        </>
                      ) : (
                        <></>
                      )}

                      {formValues.winner === home_team ? (
                        <div>Odds, {odds_1}</div>
                      ) : (
                        <></>
                      )}

                      {formValues.winner === away_team ? (
                        <div>Odds, {odds_2}</div>
                      ) : (
                        <></>
                      )}

                      {formValues.winner === "X" ? (
                        <div>Odds, {odds_x}</div>
                      ) : (
                        <></>
                      )}
                    </FormControl>
                  </div>

                  <Button variant="text" type="submit">
                    Skicka In Spel
                  </Button>
                  <br />
                </div>
              </form>
              <Typography paragraph></Typography>
              <Typography paragraph></Typography>
              <Typography paragraph></Typography>
              <Typography paragraph></Typography>
              <Typography></Typography>
            </CardContent>
          </Collapse>
        </Card>
      </div>
    </>
  );
}

export default Game;
