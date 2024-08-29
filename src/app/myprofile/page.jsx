"use client";
import Navi from "@/components/nav";
import * as S from './style';
import axios from "axios";
import { useEffect, useState } from "react";
import { RecoilRoot } from "recoil";
import PlaylistAtom from "@/components/playlistAtom";

export default function App() {
  return (
    <RecoilRoot>
      <InnerComponent />
    </RecoilRoot>
  );
}

function InnerComponent() {
  const [playlists, setPlaylists] = useState([]);
  const [username, setUsername] = useState(''); // Initial state is an empty string

  useEffect(() => {
    const nickname = localStorage.getItem('user_nickname');
    if (!nickname) {
      window.location.href = '/';
      return;
    }
    setUsername(nickname);

    const getAllPlaylist = async () => {
      try {
        const response = await axios.get('/api/playlist', {
          headers: {
            'Authorization': localStorage.getItem('user_access')
          }
        });
        setPlaylists(response.data.res);
      } catch (error) {
        console.error("Error fetching playlists:", error);
        setPlaylists([]);
      }
    };

    getAllPlaylist();
  }, []);

  return <>
    <Navi />
    <S.Profile>
      <main>
        <h1>{username || 'Loading...'}</h1>
        <h1>Playlists</h1>
        {playlists.length > 0
          ? playlists.map((i, n) => (
            <PlaylistAtom
              key={n}
              index={n}
              artist={username}
              title={i.playlist_id}
              type="playlist"
              id={i.playlist_id}
            />
          ))
          : <h2>Loading</h2>}
      </main>
      <S.PaddingBox />
    </S.Profile>
  </>;
}
