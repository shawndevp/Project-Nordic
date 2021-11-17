import React, { useState, useEffect } from "react";
import axios from "axios";
import server from "../Global/config";
import "bootstrap-icons/font/bootstrap-icons.css";
import Profile from "./Profile";

function ProfileInfo() {
  const userId = localStorage.getItem("user_id");
  const [userInfo, setUserInfo] = useState([]);
  const instance = axios.create({ baseURL: server });

  //Hämta användare och koppla server connection

  useEffect(() => {
    const fetchUserInfo = async () => {
      const response = await instance.get(`Users?id=${userId}`);
      setUserInfo(response.data);
    };
    fetchUserInfo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Hämta användare
    


    return (
        <>  
        {userInfo.map((userinfo,key)=>{
            return (
                <Profile key={key} username={userinfo.username} firstname={userinfo.fname} lastname={userinfo.lname} adress={userinfo.adress} city={userinfo.city} zipcode={userinfo.zipcode} country={userinfo.country} email={userinfo.email} created={userinfo.created_at} profilepicture={userinfo.profilepicture} score={userinfo.Score} />
            )
        })}
            
        </>
    )
    // Mappa igenom de props (Child) vi vill skicka till profile.js
}

export default ProfileInfo;
