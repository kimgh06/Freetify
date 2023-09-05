"use client"
import PlaylistAtom from "@/components/playlistAtom";
import axios from "axios";
import { useEffect } from "react";

const url = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const getTokens = async e => {
    const queries = new URLSearchParams(location.search);
    await axios.post(`${url}/getTokens`, {
      code: queries.get('code'),
      state: queries.get('state')
    }).then(e => {
      const info = e.data;
      console.log(e.data);
      if (!info?.error) {
        localStorage.setItem('access', info.access_token);
        localStorage.setItem('refresh', info.refresh_token);
        localStorage.setItem('expire', new Date().getTime() + info.expires_in * 1000);
        window.location.href = '/';
      }
    }).catch(e => {
      console.log(e);
    });
  }
  const refresh_token = async e => {
    await axios.patch(`${url}/refresh_token`,
      { refreshToken: localStorage.getItem('refresh') }).then(e => {
        console.log(e.data);
        const info = e.data;
        if (!info?.error) {
          localStorage.setItem('access', info.access_token);
          localStorage.setItem('expire', new Date().getTime() + info.expires_in * 1000);
        }
      }).catch(e => {
        console.log(e);
      })
  }
  useEffect(e => {
    const queries = new URLSearchParams(location.search);
    if (queries.size !== 0) {
      getTokens();
    } else {
      console.log((localStorage.getItem('expire') - new Date().getTime()) / 60000); //시간 계산용
      if (new Date().getTime() >= localStorage.getItem('expire')) {
        refresh_token();
      }
    }
  }, [])
  return <>
    <PlaylistAtom artist={'신해철'} title={'그대에게'} playingtime={'0:30'} playtime={'4:30'} />
  </>;
}
