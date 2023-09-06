"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const spotifyUrl = 'https://api.spotify.com/v1';

export default function asdf() {
  const [infos, setinfos] = useState(null);
  const getInfos = async e => {
    await axios.get(`${spotifyUrl}/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } })
      .then(e => {
        console.log(e.data);
        setinfos(e.data);
      }).catch(e => {
        console.log(e);
      })
  }
  useEffect(e => {
    getInfos();
  }, []);
  return <>{
    infos ? <>
      <h1>이름 : {infos?.display_name}</h1>
      <h2>지역 : {infos?.country}</h2>
      <h2> USERiD : {infos?.id}</h2>
      <h2> 요금제 : {infos?.product}</h2>
      {infos?.images?.url !== undefined && <img src={infos?.images?.url} alt="profileimg" />}
    </> : <h1>Loading...</h1>
  }
  </>;
}
