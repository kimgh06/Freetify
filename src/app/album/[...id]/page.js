"use client"

import axios from "axios";
import { useEffect, useState } from "react"

export default function asdf({ params }) {
  const id = params.id[0];
  const url = 'https://api.spotify.com/v1';
  const [albumInfo, setAlbumInfo] = useState(null);
  const getAlbumInfos = async e => {
    await axios.get(`${url}/albums/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem("access")}` } })
      .then(e => {
        console.log(e.data);
        setAlbumInfo(e.data);
      }).catch(e => {
        console.log(e);
      });
  }
  useEffect(e => {
    console.log(id);
    getAlbumInfos();
  }, []);
  return <>
    {albumInfo ? albumInfo?.name :
      <h1>Loading...</h1>}
  </>;
}