"use client"
import PlaylistAtom from "@/components/playlistAtom";
import axios from "axios";
import { useEffect } from "react";

const url = 'http://localhost:3333';

export default function Home() {
  const getTokens = async e => {
    const queries = new URLSearchParams(location.search);
    await axios.post(`${url}/getTokens`, {
      code: queries.get('code'),
      state: queries.get('state')
    }).then(e => {
      console.log(e);
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
