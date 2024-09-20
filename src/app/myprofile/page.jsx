"use client";
import Navi from "@/components/nav";
import * as S from './style';
import axios from "axios";
import { useEffect, useState } from "react";
import { RecoilRoot, useRecoilState } from "recoil";
import PlaylistAtom from "@/components/playlistAtom";
import { PlaylistsStore } from "@/app/store";
import { AccessToken } from "../recoilStates";

export default function App() {
  return (
    <RecoilRoot>
      <InnerComponent />
    </RecoilRoot>
  );
}

function InnerComponent() {
  const { playlists, setPlaylists } = PlaylistsStore();
  const [username, setUsername] = useState('');
  const [likedSong, setLikedSong] = useState([]);
  const [access, setAccess] = useRecoilState(AccessToken);

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
    }
  };

  const getTrackinfos = async ids => {
    if (ids) {
      return await axios.get(`https://api.spotify.com/v1/tracks?ids=${ids}`, { headers: { Authorization: `Bearer ${access}` } }).then(e => {
        return e.data.tracks
      }).catch(e => {
        console.log(e);
      });
    }
  }
  const getLikedSongs = async () => {
    try {
      const response = await axios.patch('/api/likesong', {}, {
        headers: {
          'Authorization': localStorage.getItem('user_access')
        }
      });
      let list = [];
      for (let i in response.data.res) {
        list.push(response.data.res[i]['song_id']);
      }
      const tracks = await getTrackinfos(list.join(','));
      console.log(tracks)
      setLikedSong(tracks);
    } catch (error) {
      console.error("Error fetching liked songs:", error);
    }
  }

  useEffect(() => {
    const nickname = localStorage.getItem('user_nickname');
    if (!nickname) {
      window.location.href = '/';
      return;
    }
    setUsername(nickname);
    getAllPlaylist();
    getLikedSongs();
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
        <h1>Liked Songs</h1>
        {likedSong?.length !== 0 && likedSong?.map((i, n) => <PlaylistAtom index={n} preview={i?.preview_url} album={i?.album} playingtime={i?.duration_ms} key={n} img={i?.album.images[2].url} type={i?.type}
          id={i?.id} title={i?.name} artist={i?.artists} artistId={i?.artists[0].id} isInPlay={e => {
            let list = [];
            list = JSON.parse(localStorage.getItem('list'));
            if (list === null) {
              list = [];
            }
            return list.find(a => a === i?.id)
          }} />)}
      </main>
    </S.Profile>
  </>;
}
