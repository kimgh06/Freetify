"use client"
import PlaylistAtom from "@/components/playlistAtom";
import axios from "axios";
import { useEffect } from "react";

const url = 'http://localhost:3333';

export default function Home() {
  const getTokens = async e => {
    const queries = new URLSearchParams(location.search);
    await axios.post(`${url}/getOptions/getTokens`, {
      code: queries.get('code'),
      state: queries.get('state')
    }).then(async e => {
      console.log(e.data);
      const info = e.data;
      localStorage.setItem('tokens', JSON.stringify({ access: info.access_token, refresh: info.refresh_token }));
      localStorage.setItem('expire', info.expires_in);
    }).catch(e => {
      console.log(e);
    });
  }
  useEffect(e => {
    const queries = new URLSearchParams(location.search);
    if (queries.size !== 0) {
      getTokens();
    }
  }, [])
  return <>
    <PlaylistAtom artist={'신해철'} title={'그대에게'} playingtime={'0:30'} playtime={'4:30'} />
  </>;
}
