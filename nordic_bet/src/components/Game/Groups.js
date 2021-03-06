import React, { useState, useEffect } from "react";
import axios from "axios";
import server from "../Global/config";
import setTeamFlag from "./Flags";
import Flags from "country-flag-icons/react/3x2";

function Groups() {
  const chunked = [];
  const useGetGames = () => {
    const [gamesArray, setGamesArray] = useState([]);
    const [loading, setLoading] = useState(true);

    const groups = [
      "EURO Grp. A",
      "EURO Grp. B",
      "EURO Grp. C",
      "EURO Grp. D",
      "EURO Grp. E",
      "EURO Grp. F",
    ];

    // Konstantera grupper

    const instance = axios.create({ baseURL: server });

    const fetchGames = async () => {
      try {
        for (let i = 0; i < groups.length; i++) {
          const { data } = await instance.get(`Euro_events?grp=${groups[i]}`);
          setGamesArray((games) => [...games, ...data]);
        }
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    };

    useEffect(() => {
      fetchGames();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return { loading, gamesArray };
  };

  // Fetcha och hämta alla grupper

  const { loading, gamesArray } = useGetGames();
  
  if (!loading) {
    // All data should be available
    
    for (let i = 0; i < gamesArray.length; i += 6) {
      //chunked is an array with all groups as arrays inside
      chunked.push(gamesArray.slice(i, i + 6));
    }

    //----------------------Function for setting group names to the countries and at the same time putting the score of each group to 0 (reset function aswell)

    // chunked.forEach((games)=>{
    //   console.log(games)
    //     const instance = axios.create({ baseURL: server });
    //     const mapTeams = []
    //     const teams = [{"name":"","score":0},{"name":"","score":0},{"name":"","score":0},{"name":"","score":0},]
    //     const team12 = games[0].eventname.split("-")
    //     const team34 = games[1].eventname.split("-")
    //     const grp = games[0].grp
    //     mapTeams.push(team12[0],team12[1],team34[0],team34[1],)
    //     teams[0].name=team12[0]
    //     teams[1].name=team12[1]
    //     teams[2].name=team34[0]
    //     teams[3].name=team34[1]
    //     console.log(teams)
    //       for (let i = 0; i < mapTeams.length ; i++) {
    //         const fetchId = async() => {
    //           const response = await instance.get(`countries?name=${mapTeams[i]}`)
    //           const countryId = response.data[0].id
    //           const putGrp = async() => {
    //             await instance.put(`countries/${countryId}`, {
    //               group:grp,
    //               group_score:0
    //           })
    //           }
    //           putGrp()
    //         }
    //         fetchId()

    //       }
    //
    //})

    //----------------------Function for putting all teams into strapi (only works with above function modified)
    // mapTeams.forEach((team)=>{
    //     instance.post(`Countries`,{
    //         name:team
    //       })
    // })

    // })
  }

  return (
    <>
    <div>
      {chunked.map((games, key) => {
        
        return (
          <div key={key} >
            <table className="table table-hover w-75 border bg-light mt-3 mx-auto">
              <thead>
                
              <tr >
                  <th scope="col"></th>
                  <th scope="col"> {games[0].grp} Games</th>
                  <th scope="col"></th>
                  <th scope="col">Status</th>
                  <th scope="col">Live Home goals </th>
                  <th scope="col">Live Away goals </th>
                  <th scope="col">Winner </th>
                </tr>
              </thead>
              <tbody>
                {games.map((game, key2) => {
                  const playingTeams = game.eventname.split("-");
                  const home_team = playingTeams[0];
                  const away_team = playingTeams[1];
                  const HomeFlag = Flags[setTeamFlag("home", home_team)];
                  const AwayFlag = Flags[setTeamFlag("away", away_team)];

                  // Mappa igenom spelen och settar dess värden med lag och flaggor.

                  return (
                    <tr key={key2}>
                      <td>
                        <HomeFlag width="40px" />
                      </td>
                      <td>{game.eventname}</td>
                      <td>
                        <AwayFlag width="40px" />
                      </td>
                      <td>{game.status}</td>
                      <td>{game.home_final}</td>
                      <td>{game.away_final}</td>
                      <td>{game.winner}</td>
                    </tr>
                  );
                })}
                
              </tbody>
            </table>
            <br />
            <br />
          </div>
        );
      })}
    </div>
    </>
  );
}

export default Groups;
