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
  const [nickname, setNickname] = useState('');
  const [access, setAccess] = useRecoilState(AccessToken);
  const getAllPlaylist = async e => {
    await axios.get(`/api/playlist`, { headers: { 'Authorization': localStorage.getItem('user_access') } })
      .then(e => {
        setPlaylists(e.data.res);
      }).catch(e => {
        console.log(e);
      })
  }
  useEffect(e => {
    if (!localStorage.getItem('user_nickname')) {
      window.location.href = '/'
      return;
    }
    setNickname(localStorage?.getItem('user_nickname'))
    getAllPlaylist();
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
          artist={localStorage.getItem('user_nickname')}
          title={i.playlist_id}
          type='playlist'
          id={i.playlist_id}
        ></PlaylistAtom>) : "Loading"}
      </main>
      <S.PaddingBox />
    </S.Profile>
  </>
}