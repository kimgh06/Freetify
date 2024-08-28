"use client";
import Navi from "@/components/nav";
import * as S from './style';
import axios from "axios";
import { useEffect, useState } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import { AccessToken } from "../recoilStates";
import PlaylistAtom from "@/components/playlistAtom";

export default function App() {
  return <RecoilRoot>
    <InnerComponent />
  </RecoilRoot>;
}

function InnerComponent() {
  const [playlists, setPlaylists] = useState([]);
  const [username, setUsername] = useState('');
  if (typeof window === 'undefined') {
    return;
  }
  if (!localStorage.getItem('user_nickname')) {
    window.location.href = '/'
    return;
  }
  const nickname = localStorage.getItem('user_nickname');

  const getAllPlaylist = async e => {
    let playlists;
    playlists = await axios.get(`/api/playlist`, { headers: { 'Authorization': localStorage.getItem('user_access') } })
      .then(e => {
        return e.data.res;
      }).catch(e => {
        return null
      })
    setPlaylists(playlists);
  }
  useEffect(e => {
    getAllPlaylist();
    const name = localStorage.getItem('user_nickname');
    if (name) setUsername(name);
  }, []);

  return <>
    <Navi />
    <S.Profile>
      <main>
        <h1>
          {nickname}
        </h1>
        <h1>
          playlists
        </h1>
        {playlists.length !== 0 ? playlists?.map((i, n) => <PlaylistAtom
          key={n}
          index={n}
          artist={username}
          title={i.playlist_id}
          type='playlist'
          id={i.playlist_id}
        ></PlaylistAtom>) : "Loading"}
      </main>
      <S.PaddingBox />
    </S.Profile>
  </>
}